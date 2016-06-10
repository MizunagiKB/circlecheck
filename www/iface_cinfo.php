<?php
// ---------------------------------------------------------------- require(s)
require_once("./app_config.php");
require_once("./libs/cls_couchdb.php");

// ------------------------------------------------------------------ const(s)
// --------------------------------------------------------------- function(s)
// ===========================================================================
/*!
 */
function valid_param($oCConn, $param)
{
    if(array_key_exists("access_token", $_SESSION) != true) die();
    if(array_key_exists("DATA_SOURCE", $_SESSION) != true) die();
    if(array_key_exists("DATA_SOURCE", $param) != true) die();
    if(array_key_exists("layout", $param) != true) die();

    $twitter_user_id = $_SESSION["access_token"]["user_id"];
    $twitter_screen_name = $_SESSION["access_token"]["screen_name"];
    $DATA_SOURCE = $_SESSION["DATA_SOURCE"];
    $layout = $param["layout"];

    if($DATA_SOURCE != $param["DATA_SOURCE"]) die();

    $result = get_twitter_user_info($oCConn, COUCHDB_DATABASE, $DATA_SOURCE, $twitter_user_id);

    $aryTwitterUserInfo = json_decode($result);

    // スペース番号・またはEVENTMANAGERの場合は編集許可
    for($i = 0; $i < count($aryTwitterUserInfo -> rows); $i ++)
    {
        if($layout == $aryTwitterUserInfo -> rows[$i] -> value -> layout)
        {
            return true;
        }

        if(EVENT_MANAGER == $aryTwitterUserInfo -> rows[$i] -> value -> layout)
        {
            return true;
        }
    }

    return false;
}


// ===========================================================================
/*!
 */
function main()
{
    session_start();

    if(array_key_exists("order", $_GET) != true) die();
    if(array_key_exists("access_token", $_SESSION) != true) die();

    $oCConn = new CCouchDB(
        array(
            "host" => COUCHDB_HOST,
            "port" => COUCHDB_PORT,
            "user" => COUCHDB_USERNAME,
            "pass" => COUCHDB_PASSWORD
        )
    );

    $order = $_GET["order"];
    $param = $_POST;
    $result = "{}";

    if(valid_param($oCConn, $param) == true)
    {
        switch($order)
        {
            case ORDER_INSERT: $result = order_insert($oCConn, COUCHDB_DATABASE_CINFO, $order, $param); break;
            case ORDER_UPDATE: $result = order_update($oCConn, COUCHDB_DATABASE_CINFO, $order, $param); break;
            case ORDER_DELETE: $result = order_delete($oCConn, COUCHDB_DATABASE_CINFO, $order, $param); break;
        }
    }

    return $result;
}


header("Content-Type: application/json; charset=utf-8");
echo main();



// --------------------------------------------------------------------- [EOF]
