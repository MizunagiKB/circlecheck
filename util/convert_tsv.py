# -*- coding: utf-8 -*-
import sys
import re

def main():

    strBuffer = open(sys.argv[1], "rb").read()
    strBuffer = strBuffer.replace("\r", "")
    strBuffer = strBuffer.replace("\n", "")

    listTable = re.findall(
        '<table class="circleList".*?>(.*?)</table>',
        strBuffer,
        re.I
    )

    for steTableBody in listTable:
        listCircle = re.findall(
            '<tr>(.*?)</tr>',
            steTableBody,
            re.I
        )
        for strCircle in listCircle:
            oCRe = re.search(
                '<td.*?>(.*?)</td>'
                '.*?'
                '<td.*?>(.*?)</td>'
                '.*?'
                '<td.*?>(.*?)</td>'
                '.*?'
                '<td.*?>(.*?)</td>'
                '.*?'
                '<td.*?>(.*?)</td>'
                '.*?'
                '<td.*?>(.*?)</td>'
                '.*?'
                '<td.*?>(.*?)</td>'
                '.*?'
                '<td.*?>(.*?)</td>',
                strCircle,
                re.I
            )

            if(oCRe is not None):
                listRecord = [oCRe.group(n).strip() for n in range(1,4)]

                for n in range(4,7):
                    oCReHP = re.search('href="(.*?)"', oCRe.group(n))
                    if(oCReHP is not None):
                        listRecord.append(oCReHP.group(1))
                    else:
                        listRecord.append("")

                print "\t".join(listRecord)

    pass


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
