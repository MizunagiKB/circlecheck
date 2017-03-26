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

    listCircle = re.findall(
        "<li.*?>(.*?)</li>",
        s,
        re.I
    )

    listFound = []
    for r in listCircle:
        oCRe = re.search("href=\"(.*?)\"", r, re.I)
        if oCRe != None:
            listFound.append(oCRe.group(1))
        else:
            listFound.append("")

    return listFound[0], listFound[3], listFound[4]

#
def strip_href(s):
    oCRe = re.search("href='(.*?)'", s, re.I)
    if oCRe != None:
        return oCRe.group(1)
    else:
        return ""

#
def main():

    strBuffer = open(sys.argv[1], "rb").read()
    strBuffer = strBuffer.replace("\r", "")
    strBuffer = strBuffer.replace("\n", "")

    listTable = re.findall(
        '<table class="md-infotable t-list-circle" style="table-layout: fixed;">(.*?)</table>',
        strBuffer,
        re.I
    )

    for strTableBody in listTable:
        listCircle = re.findall(
            "<tr class=\"infotable-sep\">(.*?)<div class=\"webcatalog-favorite-dialog-color",
            strTableBody,
            re.I
        )

        for strCircle in listCircle:

            oCRe = re.search(
                "data-webcatalog-circle-id=\"(.*?)\".*?"
                "data-webcatalog-circle-name=\"(.*?)\".*?"
                "data-webcatalog-circle-day=\"(.*?)\".*?"
                "data-webcatalog-circle-hall=\"(.*?)\".*?"
                "data-webcatalog-circle-block=\"(.*?)\".*?"
                "data-webcatalog-circle-space=\"(.*?)\".*?"
                "<ul class=\"support-list\">(.*?)</ul>"
                "",
                strCircle,
                re.I
            )

            if oCRe != None:

                "東ヌ21a - 東ネ14b"

                strUrl, strPixiv, strTwitter = circle_info(oCRe.group(7))

                strWriter = ""
                strSpace = "(" + oCRe.group(3) + ")" + oCRe.group(4) + oCRe.group(5) + oCRe.group(6)
                strCircle = oCRe.group(2)
#                strWriter = oCRe.group(2)
#                strCircle = oCRe.group(2)
#                strWriter = oCRe.group(3)
#                strUrl, strCircle = circle_info(strCircle)
#                strPixiv = strip_href(oCRe.group(4))
#                strTwitter = strip_href(oCRe.group(5))

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
