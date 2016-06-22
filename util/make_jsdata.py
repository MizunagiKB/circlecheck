# -*- coding: utf-8 -*-
##
import sys
import csv
import json
import re
import time
#import requests

#
LAYOUT_PARSE_1 = re.compile(u"([^0-9]*)[0-9]{1,2}・[0-9]{1,2}")
LAYOUT_PARSE_2 = re.compile(u"([^0-9]*)[0-9]{1,2}")
COMIC1 = u"あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへ"
#LAYOUT_PARSE_1 = re.compile(u"([^0-9]*)[0-9]{1,2}・[0-9]{1,2}")
#LAYOUT_PARSE_2 = re.compile(u"([^0-9]*)[0-9]{1,2}")

LAYOUT_PARSE_1 = re.compile(u"([^0-9]*)[0-9]{1,2},[0-9]{1,2}")
LAYOUT_PARSE_2 = re.compile(u"([^0-9]*)[0-9]{1,2}")
GRAFES = [u"グ", u"ラ", u"ブ", u"ル", u"海", u"なの", u"戦", u"城", u"DMM"]

LAYOUT_PARSE_1 = re.compile(u"([^0-9]*)-.*")
LAYOUT_PARSE_2 = LAYOUT_PARSE_1
CC = u"ABCDEFGHIJKLMNO"

LAYOUT_PARSE_1 = re.compile(u"([^0-9]*)[0-9]{1,2}-[0-9]{1,2}")
LAYOUT_PARSE_2 = re.compile(u"([^0-9]*)[0-9]{1,2}")
MESHI = u"めしけっ"

LAYOUT_PARSE_1 = re.compile(u"([^0-9]*)[0-9]{1,2}")
LAYOUT_PARSE_2 = re.compile(u"([^0-9]*)")
TOBIMONO = [u"A", u"B", u"C", u"D", u"E", u"F", u"ETC"]

#LAYOUT_PARSE_1 = re.compile(u"([^0-9]*) - [0-9]{1,2},[0-9]{1,2}")
#LAYOUT_PARSE_2 = re.compile(u"([^0-9]*) - [0-9]{1,2}")
#CIN = u"シンデレラの舞踏会"


#PRINCESS_FESTA = [u"あ", u"い", u"う", u"え", u"お", u"か", u"き", u"く", u"委託"]
class KEY_POINT(object):
    LAYOUT_PARSE_1 = re.compile(u"([^0-9]*)[0-9]{1,2}")
    LAYOUT_PARSE_2 = re.compile(u"([^0-9]*)[0-9]{1,2}")
    GROUP = [u"K", u"e", u"y"]
    DELIMITER = "\t"

class TECHBOOKFEST(object):
    LAYOUT_PARSE_1 = re.compile(u"([^0-9]*)-[0-9]{1,2}")
    LAYOUT_PARSE_2 = re.compile(u"([^0-9]*)-[0-9]{1,2}")
    GROUP = [u"A", u"B", u"K", u"I"]
    DELIMITER = ","

#KEY_POINT = [u"魔", u"伊", u"呂", u"波", u"つむぎ", u"ラブリー", u"フローラ", u"ブロッサム", u"オリヴィエ", u"タルト", u"パイン"]

#COMITIA_A = u"ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ"
#COMITIA_B = u"あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむ"
#COMITIA_C = u"展"
LAYOUT_PARSE_1 = re.compile(u"(.*?)[0-9]{1,2}.*")
LAYOUT_PARSE_2 = re.compile(u"(.*?)[0-9]{1,2}.*")



#LYRICALMAGICAL = u"なのは"
#CIRCLE = [u"アイ", u"カツ"]
LAYOUT_PARSE_1 = re.compile(u"(.*?)[0-9]{1,2}.*")
LAYOUT_PARSE_2 = re.compile(u"(.*?)[0-9]{1,2}.*")
#CIRCLE = u"ＡＣＤＥＦＧＩＪＫＬＭＮ"
#CIRCLE = u"ＡＢＣＤＥＦＧＨ"

class OMOJIN(object):
    LAYOUT_PARSE_1 = re.compile(u"([^0-9]*)-[0-9]{1,2}")
    LAYOUT_PARSE_2 = re.compile(u"([^0-9]*)-[0-9]{1,2}")
    GROUP = [u"OJ", u"主催"]
    DELIMITER = ","

class CREATION(object):
    LAYOUT_PARSE_1 = re.compile(u"([^0-9]*)[0-9]{1,2}")
    LAYOUT_PARSE_2 = re.compile(u"([^0-9]*)[0-9]{1,2}")
    GROUP = u"ABCDEFGHI"
    GROUP = u"JKLMNOPQRS"
    DELIMITER = "\t"

class GAMELEGEND(object):
    LAYOUT_PARSE_1 = re.compile(u"([^0-9]*)[0-9]{1,2}")
    LAYOUT_PARSE_2 = re.compile(u"([^0-9]*)[0-9]{1,2}")
    GROUP = [u"GL"]
    DELIMITER = "\t"

class GURUCOMI(object):
    LAYOUT_PARSE_1 = re.compile(u"([^0-9]*)[0-9]{1,2}")
    LAYOUT_PARSE_2 = re.compile(u"([^0-9]*)[0-9]{1,2}")
    GROUP = [u"通常", u"調理", u"企業"]
    DELIMITER = ","

class LOVELIVE(object):
    LAYOUT_PARSE_1 = re.compile(u"(.*?)[0-9]{1,2}.*")
    LAYOUT_PARSE_2 = re.compile(u"(.*?)[0-9]{1,2}.*")
    GROUP = [u"国", u"立", u"音", u"ノ", u"木", u"坂", u"学", u"院", u"ラブ", u"ライ", u"ブ", u"花", u"園"]
    DELIMITER = ","

class PUNIKET(object):
    LAYOUT_PARSE_1 = re.compile(u"(.*?)[0-9]{1,2}.*")
    LAYOUT_PARSE_2 = re.compile(u"(.*?)[0-9]{1,2}.*")
    GROUP = [u"ドド", u"レレ", u"ミミ", u"プリ", u"アイ", u"晴風", u"キュア", u"みつご", u"なの"]
    DELIMITER = ","

class LYRICALMAGICAL(object):
    LAYOUT_PARSE_1 = re.compile(u"(.*?)[0-9]{1,2}.*")
    LAYOUT_PARSE_2 = re.compile(u"(.*?)[0-9]{1,2}.*")
    GROUP = [u"な", u"の", u"は"]
    DELIMITER = ","

class GAMEMARKET(object):
    LAYOUT_PARSE_1 = re.compile(u"([^0-9]*)[0-9]{1,2}")
    LAYOUT_PARSE_2 = re.compile(u"([^0-9]*)[0-9]{1,2}-[0-9]{1,2}")
    GROUP = [v for v in u"ABCDEFGHIJKLMNOPQRS"] + [u"特設"]
    DELIMITER = "\t"

class UTAHIME(object):
    LAYOUT_PARSE_1 = re.compile(u"(.*?)[0-9]{1,2},[0-9]{1,2}")
    LAYOUT_PARSE_2 = re.compile(u"(.*?)[0-9]{1,2}")
    GROUP = [u"歌姫", u"シ", u"ン", u"デ", u"レ", u"ラ", u"メモ", u"ミリ", u"セキ", u"恋風", u"ゆり"]
    DELIMITER = ","

class PRDX(object):
    LAYOUT_PARSE_1 = re.compile(u"(.*?)[0-9]{1,2}・[0-9]{1,2}")
    LAYOUT_PARSE_2 = re.compile(u"(.*?)[0-9]{1,2}")
    GROUP = [u"ブラック", u"アクア", u"マーメイド"]
    DELIMITER = ","

class COMITIA_A(object):
    LAYOUT_PARSE_1 = re.compile(u"(.*?)[0-9]{1,2}")
    LAYOUT_PARSE_2 = re.compile(u"(.*?)[0-9]{1,2}")
#    GROUP = u"ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ"
#    GROUP = u"あいうえおかきくけこさしすせそたちつ"
    GROUP = u"展"
    DELIMITER = "\t"

class DENEN(object):
    LAYOUT_PARSE_1 = re.compile(u"(.*?)[0-9]{1,2}.*")
    LAYOUT_PARSE_2 = re.compile(u"(.*?)[0-9]{1,2}.*")
    GROUP = [u"田園"]

class HOURAIGEKISEN(object):
    LAYOUT_PARSE_1 = re.compile(u"SP-No\\.(.*?)-[0-9]{1,2}.*")
    LAYOUT_PARSE_2 = re.compile(u"SP-No\\.(.*?)-[0-9]{1,2}.*")
    GROUP = u"ABCDEFGHIJKLMN"
    DELIMITER = "\t"

class PUV(object):
    LAYOUT_PARSE_1 = re.compile(u"SP-No\\.(.*?)-[0-9]{1,2}.*")
    LAYOUT_PARSE_2 = re.compile(u"SP-No\\.(.*?)-[0-9]{1,2}.*")
    GROUP = u"ABCD"
    DELIMITER = "\t"

class SUNRISE_C(object):
    LAYOUT_PARSE_1 = re.compile(u"SP-No\\.(.*?)-[0-9]{1,2}.*")
    LAYOUT_PARSE_2 = re.compile(u"SP-No\\.(.*?)-[0-9]{1,2}.*")
    GROUP = u"ABCDEFGHIJKL"
    DELIMITER = "\t"

class KOBE_KANCOLLE(object):
    LAYOUT_PARSE_1 = re.compile(u"(.*?)[0-9]{1,2}.*")
    LAYOUT_PARSE_2 = re.compile(u"(.*?)[0-9]{1,2}.*")
    GROUP = [u"企画", u"住吉", u"六甲道", u"灘", u"三ノ宮", u"元町", u"神戸", u"兵庫", u"鷹取", u"須磨", u"塩屋", u"垂水"]
    DELIMITER = ","

CONF = TECHBOOKFEST


#def (dictLayout):
def circle_list(dictLayout):

    nGrp = 0
    nIndex = 1

    for s in CONF.GROUP:
        strBuffer = '{"id": "%d", "name": "%s"}' % (nGrp, s)
        print strBuffer.encode("utf-8")
        nGrp += 1

    nGrp  = 0
    for k in CONF.GROUP:

        #print dictLayout.keys()
        listItem = dictLayout[k]
        listBuffer = []
        nIndexLocal = 1

        for o in listItem:
#        for o in sorted(listItem, key=lambda obj: obj["layout"]):
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

        # 結果出力
        print exportBuffer.encode("utf-8")


def parse_layout(s):

    oCResult = CONF.LAYOUT_PARSE_1.search(s)
    if oCResult is None:
        oCResult = CONF.LAYOUT_PARSE_2.search(s)
        if oCResult is None:
            print "paser_layout error", s
            sys.exit(-1)

    return(oCResult.group(1))


def search_twitter_user_id(strTwitterURL):

    dict_result = {}

    search_result = re.search(
        "https?:\\/\\/twitter.com\\/(.*$)",
        strTwitterURL
    )

    if search_result is not None:
        screen_name = search_result.group(1).split("?")[0]

        # print strTwitterURL, search_result.groups()
        time.sleep(0.1)

        req = requests.get(strTwitterURL)
        if req.status_code in (200,):
            strHtml = req.text.encode("utf-8").replace("\r", " ").replace("\n", " ")

            search_result = re.search(
                "<div class=\"user-actions btn-group not-following.*?\".*?data-user-id=\"(.*?)\".*?data-screen-name=\"" + screen_name + "\".*?data-name=\"(.*?)\".*?>",
                strHtml
            )

            dict_result = {
                "twitter_screen_name": screen_name,
                "twitter_user_id": search_result.group(1)
            }

    return dict_result


def main():

    dictLayout = {}

    with open(sys.argv[1], "r") as hFile:
        oCReader = csv.reader(hFile, delimiter=CONF.DELIMITER)

        for r in oCReader:
            dictRecord = {
                "circle_list": {}
            }
            strLayoutBlock = ""

            r += ["", "", "", "", "", ""]
            for idx, kwd in ((0, "layout"), (1, "circle"), (2, "writer"), (3, "url"), (4, "twitter"), (5, "pixiv")):

                s = r[idx].strip().decode("utf-8")
                if s != u"　" and len(s) > 0:
                    if re.search("https?:\\/\\/twitter.com\\/(?!\\?).+", s):
                        kwd = "twitter"
                        #for k, v in search_twitter_user_id(s).items():
                        #    dictRecord["circle_list"][k] = v
                    if re.search("https?:\\/\\/www.pixiv.net\\/member.php\\?.+", s):
                        kwd = "pixiv"
                    if re.search("https?:\\/\\/pixiv.me\\/(?!\\?).+", s):
                        kwd = "pixiv"
                    dictRecord["circle_list"][kwd] = s

            try:
                dictRecord["layout"] = dictRecord["circle_list"]["layout"]
            except KeyError:
                print r, dictRecord
                sys.exit(-1)

            del dictRecord["circle_list"]["layout"]

            strLayoutBlock = parse_layout(dictRecord["layout"])

            if strLayoutBlock not in dictLayout:
                dictLayout[strLayoutBlock] = []

            dictLayout[strLayoutBlock].append(dictRecord)

        #for k in dictLayout.keys():
        #    print k
        circle_list(dictLayout)


if __name__ == "__main__":
    main()



# ---------------------------------------------------------------------- [EOF]
