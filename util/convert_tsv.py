# -*- coding: utf-8 -*-
import sys
import re

"""
<tr>
<td><img src="cut/yamada.jpg" width="400" height="282" alt="サークルカット"><td>め01</td>
<td><a href="http://shop.comiczin.jp/products/list.php?category_id=5589">やまだや</a></td>
<td>やまだえむ</td>
</tr>
"""

def circle_info(s):

    strCircle = ""
    strUrl = ""

    oCRe = re.search("<a href=\"(.*?)\">(.*?)</a>", s, re.I)
    if oCRe != None:
        strCircle = oCRe.group(2)
        strUrl = oCRe.group(1)
    else:
        strCircle = s
        strUrl = ""

    return (strCircle, strUrl)

def main():

    strBuffer = open(sys.argv[1], "rb").read()
    strBuffer = strBuffer.replace("\r", "")
    strBuffer = strBuffer.replace("\n", "")

    listTable = re.findall(
        "<table class=\"table_01\">(.*?)</table>",
        strBuffer,
        re.I
    )

    for steTableBody in listTable:
        listCircle = re.findall(
            "<tr>(.*?)</tr>",
            steTableBody,
            re.I
        )
        for strCircle in listCircle:
            oCRe = re.search(
                "<td.*?>(.*?)<td.*?>(.*?)</td>"
                ".*?"
                "<td.*?>(.*?)</td>"
                ".*?"
                "<td.*?>(.*?)</td>",
                strCircle,
                re.I
            )

            if oCRe != None:
                strSpace = oCRe.group(2)
                strCircle, strUrl = circle_info(oCRe.group(3))
                strWriter = oCRe.group(4)

                print "\t".join([strSpace, strCircle, strWriter, strUrl])


if(__name__ == "__main__"):
    main()

"""
				  <td>シ - 01</td>
				  <td>ほしのうみ</td>
				  <td>桐ト市</td>
				  <td class="imgLink"><img src="img/btn_noHP.png" alt="No HP"></td>
				  <td class="imgLink"><a href="https://twitter.com/k_toichi"><img src="img/btn_Tw.png" alt="@k_toichi"></a></td>
				  <td class="imgLink"><a href="http://www.pixiv.net/member.php?id=723874"><img src="img/btn_pixiv.png" alt="桐ト市"></a></td>
				  <td class="imgLink"><img src="img/btn_noMobage.png" alt="No Mobage"></td>
				  <td></td>
				</tr>
"""
