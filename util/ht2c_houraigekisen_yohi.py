# -*- coding: utf-8 -*-
import sys
import re

import requests

"""
"""

def circle_name(s):

    strUrl = ""

    oCRe = re.search("<font.*?>(.*?)</font>", s, re.I)
    if oCRe != None:
        strUrl = oCRe.group(1)
    else:
        strUrl = ""

    if strUrl.find("http://www.creation.gr.jp/jump/?") == 0:
        strUrl = strUrl[len("http://www.creation.gr.jp/jump/?"):]

    return strUrl


# ============================================================================
#
#
def circle_info(s):

    strUrl = ""
    strCircle = ""
    strSpace = ""

    oCRe1 = re.search("<a.*?href=\"(.*?)\".*?>(.*?)</a><br>(.*)", s, re.I)
    oCRe2 = re.search("(.*?)<br>(.*)", s, re.I)

    if oCRe1 != None:
        strUrl = oCRe1.group(1).strip()
        strCircle = oCRe1.group(2).strip()
        strSpace = oCRe1.group(3).strip()
        #print oCRe1.groups()
        #sys.exit()
#        if strUrl.find("?"):
#            strUrl = strUrl.split("?")[1]
#        strCircle, strSpace = s.split("<br>")
#        strCircle = strCircle.strip()
#        strSpace = strSpace.strip()
    elif oCRe2 != None:
        #strCircle = oCRe2.group(1).replace("　　", "").strip()
        strCircle = oCRe2.group(1).strip()
        strSpace = oCRe2.group(2).strip()
    else:
        sys.exit(1)
#        strCircle = s

#    o = re.search('<FONT.*?>(.*)</FONT>', strCircle, re.I)
#    if o is not None:
#        strCircle = o.group(1)

    return strUrl, strCircle, strSpace

#
def strip_href(s):
    oCRe = re.search("href='(.*?)'", s, re.I)
    if oCRe != None:
        return oCRe.group(1)
    else:
        return ""


# ============================================================================
#
#
def main():

    if sys.argv[1].find("http") == 0:
        r = requests.get(sys.argv[1])
        strBuffer = r.content.decode("euc-jp")
    else:
        strBuffer = open(sys.argv[1], "r").read()

    strBuffer = strBuffer.replace("\r", "")
    strBuffer = strBuffer.replace("\n", "")

    listTable = re.findall(
        "(.*)",
        strBuffer,
        re.I
    )

    for strTableBody in listTable:
        listCircle = re.findall(
            '<table width="400" border="0" cellpadding="0" cellspacing="0">(.*?)</table>',
            strTableBody,
            re.I
        )

        for s in listCircle:
            oCRe = re.search(
                '<tr>.*?'
                '<td.*?>(.*?)</td>.*?'
                '<td.*?>(.*?)</td>.*?'
                '</tr>',
                s,
                re.I
            )

            if oCRe != None:

                strWriter = ""
                strPixiv = ""
                strTwitter = ""
                strUrl = ""
                strUrl, strCircle, strSpace = circle_info(oCRe.group(1))
                strWriter = oCRe.group(2).strip()

                if strUrl.find("http://www.pixiv") >= 0:
                    strPixiv = strUrl
                    strUrl = ""
                if strUrl.find("https://twitter") >= 0:
                    strTwitter = strUrl
                    strUrl = ""
                if strUrl.find("http://twitter") >= 0:
                    strTwitter = strUrl
                    strUrl = ""

                print("\t".join([strSpace, strCircle, strWriter, strUrl, strTwitter, strPixiv]))


if(__name__ == "__main__"):
    main()
