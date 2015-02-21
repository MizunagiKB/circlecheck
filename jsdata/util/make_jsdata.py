# -*- coding: utf-8 -*-
##
import sys
import csv
import json
import re

#
LAYOUT_PARSE_1 = re.compile(u"([^0-9]*)[0-9]{1,2}・[0-9]{1,2}")
LAYOUT_PARSE_2 = re.compile(u"([^0-9]*)[0-9]{1,2}")
COMITIA_A = u"ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ"
COMITIA_B = u"あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめも"
COMITIA_C = u"展"
LYRICALMAGICAL = u"なのは"
LOVELIVE = [u"ラブ"]
KOBE_KANCOLLE = [u"須磨", u"有馬", u"兵庫", u"長田", u"湊", u"元町", u"神戸", u"葺合", u"灘" ]


def circle_list(dictLayout):

    nIndex = 0

    for k in KOBE_KANCOLLE:

        listItem = dictLayout[k]
        listBuffer = []

        for o in sorted(listItem, key=lambda obj: obj["layout"]):
            listBuffer.append(
                "    {\"layout\": \"%s\",\n"
                "        \"circle_list\": [\n"
                "            %s\n"
                "        ]\n"
                "    }" % (
                    o["layout"],
                    json.dumps(o["circle_list"], ensure_ascii=False)
                )
            )

        exportBuffer = ""
        exportBuffer += "\"%d\" : [\n" % (nIndex,)
        exportBuffer += ",\n".join(listBuffer)
        exportBuffer += "\n"
        exportBuffer += "],\n"

        nIndex += 1

        print exportBuffer.encode("utf-8")


def parse_layout(s):

    oCResult = LAYOUT_PARSE_1.search(s)
    if(oCResult is None):
        oCResult = LAYOUT_PARSE_2.search(s)
        if(oCResult is None):
            print "paser_layout error", s
            sys.exit(-1)

    return(oCResult.group(1))


def main():

    dictLayout = {}

    with open(sys.argv[1], "r") as hFile:
        oCReader = csv.reader(hFile, delimiter=",")

        for r in oCReader:
            dictRecord = {
                "circle_list": {}
            }
            strLayoutBlock = ""

            for idx, kwd in ((0, "layout"), (1, "circle"), (2, "writer"), (3, "url")):
                s = r[idx].strip().decode("utf-8")
                if(s != u"　" and len(s) > 0):
                    dictRecord["circle_list"][kwd] = s

            dictRecord["layout"] = dictRecord["circle_list"]["layout"]
            del dictRecord["circle_list"]["layout"]

            strLayoutBlock = parse_layout(dictRecord["layout"])

            if(strLayoutBlock not in dictLayout):
                dictLayout[strLayoutBlock] = []

            dictLayout[strLayoutBlock].append(dictRecord)

        circle_list(dictLayout)


if(__name__ == "__main__"):
    main()
