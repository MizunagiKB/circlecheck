<?php
// ------------------------------------------------------------------ const(s)
const ORDER_INSERT = "insert";
const ORDER_UPDATE = "update";
const ORDER_DELETE = "delete";

// ------------------------------------------------------------------ class(s)
// ---------------------------------------------------------------------------
/*!
 */
class CCouchDB {

    //
    function CCouchDB($options)
    {
        foreach($options AS $key => $value)
        {
            $this -> $key = $value;
        }
    }

    //
    function send($method, $url, $post_data=NULL)
    {
        $s = fsockopen($this -> host, $this -> port, $errno, $errstr);
        if(!$s)
        {
            echo "$errno: $errstr\n";
            return false;
        }

        $request = "$method $url HTTP/1.0\r\nHost: $this->host\r\n";

        if ($this -> user) {
            $request .= "Authorization: Basic ".base64_encode("$this->user:$this->pass")."\r\n";
        }

        if($post_data) {
            $request .= "Content-Type: application/json\r\n";
            $request .= "Content-Length: ".strlen($post_data)."\r\n\r\n";
            $request .= "$post_data\r\n";
        } else {
            $request .= "\r\n";
        }

        fwrite($s, $request);
        $response = "";

        while(!feof($s))
        {
            $response .= fgets($s);
        }

        $list_responce = explode("\r\n\r\n", $response);
        $json_result = "";
        for($n = 1; $n < count($list_responce); $n ++)
        {
            $json_result .= $list_responce[$n];
        }
        $this -> headers = $list_responce[0];
        $this -> body = $json_result;

        return $this -> body;
    }
}


// --------------------------------------------------------------- function(s)
// ===========================================================================
/*!
 */
function make_record($order, $aryParam)
{
    $aryResult = array();

    if(in_array($order, array(ORDER_UPDATE, ORDER_DELETE)) == true)
    {
        $aryResult["_id"] = $aryParam["_id"];
        $aryResult["_rev"] = $aryParam["_rev"];
    }

    if(in_array($order, array(ORDER_INSERT, ORDER_UPDATE)) == true)
    {
        if(strlen($aryParam["cedit_date"]) > 10) die();
        $aryResult["cedit_date"] = $aryParam["cedit_date"];

        $aryResult["cedit_category"] = (int)$aryParam["cedit_category"];
        $aryResult["cedit_rating"] = (int)$aryParam["cedit_rating"];

        if(strlen($aryParam["cedit_url"]) > 192) die();
        if(isset($aryParam["cedit_url"])) $aryResult["cedit_url"] = $aryParam["cedit_url"];

        if(strlen($aryParam["cedit_txt"]) > 192) die();
        if(isset($aryParam["cedit_txt"])) $aryResult["cedit_txt"] = htmlspecialchars($aryParam["cedit_txt"]);

        $aryResult["DATA_SOURCE"] = $aryParam["DATA_SOURCE"];
        $aryResult["layout"] = $aryParam["layout"];
    }

    return $aryResult;
}


// ===========================================================================
/*!
 */
function get_record_count($oCConn, $database, $aryDocument)
{
    $result = $oCConn -> send(
        "GET",
        $database . "/_design/event/_view/circle_information_w_layout?key=". json_encode(array($aryDocument["DATA_SOURCE"], $aryDocument["layout"]))
    );

    $aryResult = json_decode($result);

    return $aryResult -> rows[0] -> value;
}


// ===========================================================================
/*!
 */
function order_insert($oCConn, $database, $order, $aryParam)
{
    $aryDocument = make_record($order, $aryParam);

    if(get_record_count($oCConn, $database, $aryDocument) < 5)
    {
        // http://mizuvm01.cloudapp.net/gadgets/circlecheck/iface_cinfo.php?order=insert
        $result = $oCConn -> send(
            "POST",
            $database . "/",
            json_encode($aryDocument)
        );

        return $result;
    }

    return array();
}


// ===========================================================================
/*!
 */
function order_update($oCConn, $database, $order, $aryParam)
{
    $aryDocument = make_record($order, $aryParam);

    // http://mizuvm01.cloudapp.net/gadgets/circlecheck/iface_cinfo.php?order=update
    $result = $oCConn -> send(
        "PUT",
        $database . "/" . $aryDocument["_id"],
        json_encode($aryDocument)
    );

    return $result;
}


// ===========================================================================
/*!
 */
function order_delete($oCConn, $database, $order, $aryParam)
{
    $aryDocument = make_record($order, $aryParam);

    // http://mizuvm01.cloudapp.net/gadgets/circlecheck/iface_cinfo.php?order=delete
    $result = $oCConn -> send(
        "DELETE",
        $database . "/" . $aryDocument["_id"] . "?rev=" . $aryDocument["_rev"]
    );

    return $result;
}


// ===========================================================================
/*!
 */
function get_twitter_user_info($oCConn, $database, $EVENT_SOURCE, $twitter_user_id)
{
    //http://mizuvm01.cloudapp.net/gadgets/circlecheck/iface_auth.php?doc_id="lyricalmagical_21"
    //http://127.0.0.1:5984/circlecheck/_design/catalog/_view/twitter_user?key=["lyricalmagical_21","431236837"]

    $result = $oCConn -> send(
        "GET",
        $database . "/_design/catalog/_view/twitter_user?key=" . json_encode(array($EVENT_SOURCE, $twitter_user_id)) . "&reduce=false"
    );

    return $result;
}



// --------------------------------------------------------------------- [EOF]
