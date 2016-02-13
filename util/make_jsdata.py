# -*- coding: utf-8 -*-
##
import sys
import csv
import json
import re

#
#LAYOUT_PARSE_1 = re.compile(u"([^0-9]*)[0-9]{1,2}・[0-9]{1,2}")
#LAYOUT_PARSE_2 = re.compile(u"([^0-9]*)[0-9]{1,2}")
#COMIC1 = u"あいうえおかきくけこさしすせそたちつてとなにぬねのはひふ"
#LAYOUT_PARSE_1 = re.compile(u"([^0-9]*)[0-9]{1,2}・[0-9]{1,2}")
#LAYOUT_PARSE_2 = re.compile(u"([^0-9]*)[0-9]{1,2}")

#LAYOUT_PARSE_1 = re.compile(u"SP-No.(.*?)-.*")
#LAYOUT_PARSE_2 = re.compile(u"SP-No.(.*?)-.*")
#HOURAIGEKISEN = [u"A", u"B", u"C", u"D", u"E", u"F", u"G", u"H", u"I", u"J", u"K", u"L", u"M"]
#LAYOUT_PARSE_1 = re.compile(u"(SP-No.).*")
#LAYOUT_PARSE_2 = re.compile(u"(SP-No.).*")
#HOURAIGEKISEN = [u"SP-No."]

LAYOUT_PARSE_1 = re.compile(u"([^0-9]*)[0-9]{1,2},[0-9]{1,2}")
LAYOUT_PARSE_2 = re.compile(u"([^0-9]*)[0-9]{1,2}")
GRAFES = [u"グ", u"ラ", u"ブ", u"ル", u"海", u"なの", u"戦", u"城", u"DMM"]

LAYOUT_PARSE_1 = re.compile(u"([^0-9]*)-.*")
LAYOUT_PARSE_2 = LAYOUT_PARSE_1
CC = u"ABCDEFGHIJKLMNO"

LAYOUT_PARSE_1 = re.compile(u"([^0-9]*)[0-9]{1,2}-[0-9]{1,2}")
LAYOUT_PARSE_2 = re.compile(u"([^0-9]*)[0-9]{1,2}")
MESHI = u"めしけっ"

#LAYOUT_PARSE_1 = re.compile(u"([^0-9]*) - [0-9]{1,2},[0-9]{1,2}")
#LAYOUT_PARSE_2 = re.compile(u"([^0-9]*) - [0-9]{1,2}")
#CIN = u"シンデレラの舞踏会"


#PRINCESS_FESTA = [u"あ", u"い", u"う", u"え", u"お", u"か", u"き", u"く", u"委託"]
#KEY_POINT = [u"K", u"e", u"y"]
KEY_POINT = [u"魔", u"伊", u"呂", u"波", u"つむぎ", u"ラブリー", u"フローラ", u"ブロッサム", u"オリヴィエ", u"タルト", u"パイン"]

UTAHIME = [u"歌", u"姫", u"シ", u"ン", u"デ", u"レ", u"ラ", u"メモ", u"ミリ", u"唯"]

#COMITIA_A = u"ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ"
#COMITIA_B = u"あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむ"
#COMITIA_C = u"展"
#LAYOUT_PARSE_1 = re.compile(u"(.*?)[0-9]{1,2}.*")
#LAYOUT_PARSE_2 = re.compile(u"(.*?)[0-9]{1,2}.*")

LYRICALMAGICAL = u"なのは"
LOVELIVE = [u"ラブ"]
#CIRCLE = [u"アイ", u"カツ"]
CIRCLE = [u"国", u"立", u"音", u"ノ", u"木", u"坂", u"学", u"院", u"ラブ", u"ライ", u"ブ"]
#CIRCLE = u"ＡＣＤＥＦＧＩＪＫＬＭＮ"
CIRCLE = u"ＡＢＣＤＥＦＧＨ"
KOBE_KANCOLLE = [u"三宮", u"元町", u"新開地", u"灘", u"湊川", u"和田岬"]
#PUNIKET = [u"ドド", u"レレ", u"ミミ", u"ロロ", u"ニニ", u"ファファ", u"アイ", u"キュア", u"なの"]
PUNIKET = [u"円環", u"マミ", u"ほむ", u"探偵", u"うん", u"スト", u"キュア",
u"宝石", u"咲", u"ミク", u"電磁", u"プリ", u"ゆり", u"戦車", u"イリヤ", u"なの", u"ヤマ", u"犬",
u"DC", u"フミナ", u"うさぎ", u"甘城", u"ツイン", u"天使", u"勇者", u"D", u"SHT"
]

def circle_list(dictLayout):

    nGrp = 0
    nIndex = 1

    for k in MESHI:

        #print dictLayout.keys()
        listItem = dictLayout[k]
        listBuffer = []
        nIndexLocal = 1

        for o in sorted(listItem, key=lambda obj: obj["layout"]):
            listBuffer.append(
                "            {\"layout\": \"%s\", \"sortkey\": \"%03d-%04d-%08d\",\n"
                "                \"circle_list\": [\n"
                "                    %s\n"
                "                ]\n"
                "            }" % (
                    o["layout"],
                    nGrp + 1, nIndexLocal, nIndex,
                    json.dumps(o["circle_list"], ensure_ascii=False)
                )
            )
            nIndexLocal += 1
            nIndex += 1

        exportBuffer = ""
        exportBuffer += "        \"%d\" : [\n" % (nGrp,)
        exportBuffer += ",\n".join(listBuffer)
        exportBuffer += "\n        "
        exportBuffer += "],"

        nGrp += 1

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
        oCReader = csv.reader(hFile, delimiter="\t")

        for r in oCReader:
            dictRecord = {
                "circle_list": {}
            }
            strLayoutBlock = ""

            r.append("")
            r.append("")
#            print len(r)
#            for idx, kwd in ((0, "layout"), (1, "circle"), (2, "url")):
            for idx, kwd in ((0, "layout"), (1, "circle"), (2, "writer"), (3, "url"), (4, "twitter"), (5, "pixiv")):

                s = r[idx].strip().decode("utf-8")
                if(s != u"　" and len(s) > 0):
                    dictRecord["circle_list"][kwd] = s

            try:
                dictRecord["layout"] = dictRecord["circle_list"]["layout"]
            except KeyError:
                print r, dictRecord
                sys.exit(-1)

            del dictRecord["circle_list"]["layout"]

            strLayoutBlock = parse_layout(dictRecord["layout"])

            if(strLayoutBlock not in dictLayout):
                dictLayout[strLayoutBlock] = []

            dictLayout[strLayoutBlock].append(dictRecord)

        #for k in dictLayout.keys():
        #    print k
        circle_list(dictLayout)


if(__name__ == "__main__"):
    main()
