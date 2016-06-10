<?php
// ---------------------------------------------------------------- require(s)
require_once("./app_config.php");
require("./twitteroauth/autoload.php");

use Abraham\TwitterOAuth\TwitterOAuth;


// --------------------------------------------------------------- function(s)
// ===========================================================================
/*!
 */
function sess_init($order, $jsdata)
{
    $connection = new TwitterOAuth(TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET);
    $request_token = $connection -> oauth("oauth/request_token");

    $_SESSION["oauth_token"] = $request_token["oauth_token"];
    $_SESSION["oauth_token_secret"] = $request_token["oauth_token_secret"];
    $_SESSION["jsdata"] = $jsdata;

    //Twitter.com 上の認証画面のURLを取得( この行についてはコメント欄も参照 )
    $url = $connection -> url(
        "oauth/authenticate",
        array(
            "oauth_token" => $request_token["oauth_token"]
        )
    );

    //Twitter.com の認証画面へリダイレクト
    header("location: " . $url);
}


// ===========================================================================
/*!
 */
function sess_term($order, $jsdata)
{
    $_SESSION = array();

    // セッションを切断するにはセッションクッキーも削除する。
    // Note: セッション情報だけでなくセッションを破壊する。
    if (isset($_COOKIE[session_name()])) {
        setcookie(session_name(), '', time()-42000, '/');
    }

    // 最終的に、セッションを破壊する
    session_destroy();

    header("location: " . LOGIN_LOCATION . "?jsdata=" . $jsdata . "&m=cinfo");
}


function main()
{
    session_start();

    if(array_key_exists("order", $_GET) != true) die();
    if(array_key_exists("jsdata", $_GET) != true) die();

    $order = $_GET["order"];
    $jsdata = $_GET["jsdata"];

    switch($order)
    {
        case "init": sess_init($order, $jsdata); break;
        case "term": sess_term($order, $jsdata); break;
    }
}


main();



// --------------------------------------------------------------------- [EOF]
