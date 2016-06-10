<?php
// ---------------------------------------------------------------- require(s)
require_once("./app_config.php");
require("./twitteroauth/autoload.php");

use Abraham\TwitterOAuth\TwitterOAuth;


// --------------------------------------------------------------- function(s)
// ===========================================================================
/*!
 */
function main()
{
    session_start();

    $request_token = array();
    $request_token["oauth_token"] = $_SESSION["oauth_token"];
    $request_token["oauth_token_secret"] = $_SESSION["oauth_token_secret"];

    if(isset($_REQUEST["oauth_token"]) && $request_token["oauth_token"] !== $_REQUEST["oauth_token"])
    {
        die();
    }

    $connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $request_token["oauth_token"], $request_token["oauth_token_secret"]);

    $_SESSION["access_token"] = $connection->oauth("oauth/access_token", array("oauth_verifier" => $_REQUEST["oauth_verifier"]));

    session_regenerate_id();

    header("location: " . LOGIN_LOCATION + "?jsdata=" . $_SESSION["jsdata"] . "&m=cinfo");
}


main()



// --------------------------------------------------------------------- [EOF]
