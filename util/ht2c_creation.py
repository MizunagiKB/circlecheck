# -*- coding: utf-8 -*-
import sys
import re

"""
"""

def circle_name(s):

    strUrl = ""

    oCRe = re.search("<a href=\"(.*?)\"", s, re.I)
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

    oCRe1 = re.search("<A href='(.*?)'.*?>(.*?)</A>", s, re.I)
    oCRe2 = re.search("(.*)", s, re.I)

    if oCRe1 != None:
        strUrl = oCRe1.group(1)
        strCircle = oCRe1.group(2)
    elif oCRe2 != None:
        strCircle = oCRe2.group(1)
        strCircle = strCircle.strip()
    else:
        sys.exit()

    return strUrl, strCircle

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
        "<table summary=\"\" border=\"1\" cellspacing=\"0\">(.*?)</table>",
        strBuffer,
        re.I
    )

    for strTableBody in listTable:
        listCircle = re.findall(
            "<tr.*?>(.*?)</tr>",
            strTableBody,
            re.I
        )

        # print strTableBody

        for strCircle in listCircle:
            oCRe = re.search(
                "<td>(.*?)</td>.*?"
                "<td>(.*?)</td>.*?"
                "<td>(.*?)</td>.*?"
                "<td>(.*?)</td>",
                strCircle,
                re.I
            )

            if oCRe != None:

                strPixiv = ""
                strTwitter = ""
                strWriter = ""
                strSpace = oCRe.group(1)
                strUrl, strCircle = circle_info(oCRe.group(2))
                strWriter = oCRe.group(3)
#                strCircle = oCRe.group(2)
#                strWriter = oCRe.group(3)
#                strUrl, strCircle = circle_info(strCircle)
                strUrl = circle_name(oCRe.group(4))
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
