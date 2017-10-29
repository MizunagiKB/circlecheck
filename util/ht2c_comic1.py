# -*- coding: utf-8 -*-
import sys
import re

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


#
def circle_info(s):

    strUrl = ""
    strCircle = ""

    oCRe = re.search("<a href=\"(.*?)\".*?>(.*?)</a>", s, re.I)

    if oCRe is not None:
        strUrl = oCRe.group(1)
        strCircle = oCRe.group(2)
    else:
        strCircle = s

    return strCircle, strUrl


#
def main():

    strBuffer = open(sys.argv[1], "rb").read()
    strBuffer = strBuffer.replace("\r", "")
    strBuffer = strBuffer.replace("\n", "")

    listTable = re.findall(
        '<table.*?>(.*?)</table>',
        strBuffer,
        re.I
    )

    for strTableBody in listTable:
        listCircle = re.findall(
            "<tr>(.*?)</tr>",
            strTableBody,
            re.I
        )

        for strCircle in listCircle:

            oCRe = re.search(
                "<td>(.*?)</td>.*?"
                "<td>(.*?)</td>.*?"
                "<td>(.*?)</td>.*?"
                "<td>(.*?)</td>.*?"
                "",
                strCircle,
                re.I
            )

            if oCRe != None:

                strWriter = ""
                strPixiv = ""

                strCircle, strUrl = circle_info(oCRe.group(1))
                strName, strTwitter = circle_info(oCRe.group(3))
                strSpace = oCRe.group(4)

                if strUrl.find("http://www.pixiv") >= 0:
                    strPixiv = strUrl
                    strUrl = ""
                if strUrl.find("https://twitter") >= 0:
                    strTwitter = strUrl
                    strUrl = ""
                if strUrl.find("http://twitter") >= 0:
                    strTwitter = strUrl
                    strUrl = ""

                print "\t".join([strSpace, strCircle, strWriter, strUrl, strTwitter, strPixiv])
#                print oCRe.group(1)


if(__name__ == "__main__"):
    main()
