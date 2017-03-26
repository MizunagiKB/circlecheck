# -*- coding: utf-8 -*-
import sys
import re

"""
"""

def parse_text(s):

    strUrl = ""

    oCRe = re.search("<br>", s, re.I)

    if oCRe != None:
        strUrl = ""
    else:
        strUrl = s

    return strUrl


#
def parse_url(s):

    strUrl = ""
    strPixiv = ""

    oCRe = re.search(r"<a.*?href=\"(.*?)\".*?>\[web\]</a>", s, re.I)
    if oCRe != None:
        strUrl = oCRe.group(1)

    oCRe = re.search(r"<a.*?href=\"(.*?)\".*?>\[pixiv\]</a>", s, re.I)
    if oCRe != None:
        strPixiv = oCRe.group(1)

    return strUrl, strPixiv

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
        '<br class=\'wp_social_bookmarking_light_clear\' /><table>.*?<tbody>(.*?)</tbody>.*?</table>',
        strBuffer,
        re.I
    )

    for strTableBody in listTable:
        listCircle = re.findall(
            "<tr.*?>(.*?)</tr>",
            strTableBody,
            re.I
        )

        for strCircle in listCircle:
            oCRe = re.search(
                "<td.*?>(.*?)</td>"
                ".*?"
                "<td.*?>(.*?)</td>"
                ".*?"
                "<td.*?>(.*?)</td>"
                ".*?"
                "<td.*?>(.*?)</td>",
                strCircle,
                re.I
            )

            #print strCircle

            if oCRe != None:

                strPixiv = ""
                strTwitter = ""
                strWriter = ""

                strSpace = parse_text(oCRe.group(1))
                strCircle = parse_text(oCRe.group(2))
                strWriter = parse_text(oCRe.group(3))
                strUrl, strPixiv = parse_url(oCRe.group(4))

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
