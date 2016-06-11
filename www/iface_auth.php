<?php
// ---------------------------------------------------------------- require(s)
require_once("./app_config.php");
require_once("./libs/cls_couchdb.php");

// --------------------------------------------------------------- function(s)
// ===========================================================================
/*!
 */
function main()
{
    session_start();

    if(array_key_exists("DATA_SOURCE", $_GET) != true) die();
    if(array_key_exists("access_token", $_SESSION) != true)
    {
        return json_encode(array());
    }

    $oCConn = new CCouchDB(
        array(
            "host" => COUCHDB_HOST,
            "port" => COUCHDB_PORT,
            "user" => COUCHDB_USERNAME,
            "pass" => COUCHDB_PASSWORD
        )
    );

    $DATA_SOURCE = $_GET["DATA_SOURCE"];
    $twitter_user_id = $_SESSION["access_token"]["user_id"];
    $twitter_screen_name = $_SESSION["access_token"]["screen_name"];

    $result = get_twitter_user_info($oCConn, COUCHDB_DATABASE, $DATA_SOURCE, $twitter_user_id);

    $aryTwitterUserInfo = json_decode($result);
    $aryLayout = array();

    for($i = 0; $i < count($aryTwitterUserInfo -> rows); $i ++)
    {
        array_push($aryLayout, $aryTwitterUserInfo -> rows[$i] -> value -> layout);
    }

    $_SESSION["DATA_SOURCE"] = $DATA_SOURCE;

    $aryResult = array(
        "twitter_user_id" => $twitter_user_id,
        "twitter_screen_name" => $twitter_screen_name,
        "DATA_SOURCE" => $DATA_SOURCE,
        "layout_list" => $aryLayout
    );

    return json_encode($aryResult);
}


header("Content-Type: application/json; charset=utf-8");
echo main();



// --------------------------------------------------------------------- [EOF]
