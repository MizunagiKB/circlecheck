# -*- coding: utf-8 -*-
import sys
import re

"""
    <a _ngcontent-fgq-3="" class="circle-item" href="#K-10">
        <span _ngcontent-fgq-3="" class="circle-num">10</span>
        <span _ngcontent-fgq-3="" class="circle-name hidden-xs-up">アスキードワンゴ</span>
        <img _ngcontent-fgq-3="" class="img-fluid" src="/api/image/5639955095224320.png" alt="アスキードワンゴ" title="" data-original-title="アスキードワンゴ">
    </a>
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

#    oCRe1 = re.search("<a href=\"(.*?)\".*?>(.*?)</a>.*?<br>(.*)", s, re.I)
#    oCRe2 = re.search("(.*?)<br>(.*)", s, re.I)
    oCRe1 = re.search("<A href=\"(.*?)\".*?>(.*?)</A>", s, re.I)
    oCRe2 = re.search('<FONT.*?>(.*)</FONT>', s, re.I)

    if oCRe1 != None:
        strUrl = oCRe1.group(1).strip()
        strCircle = oCRe1.group(2).strip()
        #print oCRe1.groups()
        #sys.exit()
#        if strUrl.find("?"):
#            strUrl = strUrl.split("?")[1]
#        strCircle, strSpace = s.split("<br>")
#        strCircle = strCircle.strip()
#        strSpace = strSpace.strip()
    elif oCRe2 != None:
        #strCircle = oCRe2.group(1).replace("　　", "").strip()
        #strSpace = oCRe2.group(2).strip()
        strCircle = oCRe2.group(1).strip()
    else:
        pass

    o = re.search('<FONT.*?>(.*)</FONT>', strCircle, re.I)
    if o is not None:
        strCircle = o.group(1)

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

    strBuffer = open(sys.argv[1], "rb").read()
    strBuffer = strBuffer.replace("\r", "")
    strBuffer = strBuffer.replace("\n", "")

    listTable = re.findall(
        "(.*)",
        strBuffer,
        re.I
    )

    for strTableBody in listTable:
        listCircle = re.findall(
            '<a _ngcontent-fgq-3="".*?href="(.*?)">(.*?)</a>',
            strTableBody,
            re.I
        )

        for listRe in listCircle:
            #print strCircle
            #sys.exit()
            strSpace = listRe[0][1:]
            strCircle = listRe[1]

            oCRe = re.search(
                '<span _ngcontent-fgq-3="" class="circle-name hidden-xs-up">(.*?)</span>',
                strCircle,
                re.I
            )

            if oCRe != None:

                strWriter = ""
                strPixiv = ""
                strTwitter = ""
                strUrl = ""
                strCircle = oCRe.group(1)
#                strUrl, strCircle, _ = circle_info(oCRe.group(2))
#                strWriter = oCRe.group(3)
#                strWriter = oCRe.group(3)
#                strWriter = oCRe.group(3)
#                strUrl, _, _ = circle_info(oCRe.group(4))
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

                strCircle = strCircle.replace("<BR>", "").strip()
                strWriter = strWriter.replace("<BR>", "").strip()

                print "\t".join([strSpace, strCircle, strWriter, strUrl, strTwitter, strPixiv])
#                print oCRe.group(1)


if(__name__ == "__main__"):
    main()
