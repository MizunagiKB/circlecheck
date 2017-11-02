# -*- coding: utf-8 -*-
##
import sys
import csv
import json
import re
import time
import requests
import couchdb

import configure

#
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
class COMICMARKET(object):
    LAYOUT_PARSE_1 = re.compile(u"(\(.*?\)[東|西]).*?[0-9]{1,2}.*")
    LAYOUT_PARSE_2 = re.compile(u"(.*?)[0-9]{1,2}.*")
    GROUP = [u"(木)東", u"(木)西", u"(金)東", u"(土)東", u"(土)西"]
    DELIMITER = "\t"

class COMIC1(object):
    LAYOUT_PARSE_1 = re.compile(u"([^0-9]*)[0-9]{1,2}・[0-9]{1,2}")
    LAYOUT_PARSE_2 = re.compile(u"([^0-9]*)[0-9]{1,2}")
    GROUP = u"あいうえおかきくけこさしすせそ"
    DELIMITER = "\t"

class KEY_POINT(object):
    LAYOUT_PARSE_1 = re.compile(u"([^0-9]*)[0-9]{1,2}")
    LAYOUT_PARSE_2 = re.compile(u"([^0-9]*)[0-9]{1,2}")
    GROUP = [u"K", u"e", u"y", u"車"]
    DELIMITER = "\t"

class TECHBOOKFEST(object):
    LAYOUT_PARSE_1 = re.compile(u"([^0-9]*)-[0-9]{1,2}")
    LAYOUT_PARSE_2 = re.compile(u"([^0-9]*)-[0-9]{1,2}")
    GROUP = [u"A", u"B", u"K", u"I"]
    DELIMITER = ","

class PANZER(object):
    LAYOUT_PARSE_1 = re.compile(u"([^0-9]*)-[0-9]{1,2}")
    LAYOUT_PARSE_2 = re.compile(u"([^0-9]*)-[0-9]{1,2}")
    GROUP = u"ABCDEFGHIJKL"
    DELIMITER = ","

#KEY_POINT = [u"魔", u"伊", u"呂", u"波", u"つむぎ", u"ラブリー", u"フローラ", u"ブロッサム", u"オリヴィエ", u"タルト", u"パイン"]

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
    #GROUP = u"JKLMNOPQRS"
    #GROUP = u"アイウエオカキクケ"
    DELIMITER = "\t"

class COMICNEXT(object):
    LAYOUT_PARSE_1 = re.compile(u"([^0-9]*)[0-9]{1,2}")
    LAYOUT_PARSE_2 = re.compile(u"([^0-9]*)[0-9]{1,2}")
    GROUP = u"ABCDEFG"
    DELIMITER = "\t"

class TREASURE(object):
    LAYOUT_PARSE_1 = re.compile(u"([^0-9]*)[0-9]{1,2}")
    LAYOUT_PARSE_2 = re.compile(u"([^0-9]*)[0-9]{1,2}")
    GROUP = u"アイウエオカキクケコサシスセソタチツテトナニヌネノ"
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
#    GROUP = u"ABCDEFGHIJK"
    GROUP = [u"音", u"ノ", u"木", u"サン", u"シャ", u"イン", u"ことり", u"梨子", u"ルビィ", u"穂乃果", u"千歌"]

#    GROUP = [u"ラブ", u"ライブ", u"花陽", u"凛花", u"ダイヤ"]
#    GROUP = [u"国", u"立", u"音", u"ノ", u"木", u"坂", u"浦", u"星", u"サン", u"シャ", u"イン"]
#    GROUP = [u"僕", u"ラ", u"ブ", u"沼", u"津"]
    #GROUP = [u"や", u"ざ", u"わ", u"に", u"こ"]
    DELIMITER = ","

class ONLINEGAME_UNION(object):
    LAYOUT_PARSE_1 = re.compile(u"(.*?)[0-9]{1,2}.*")
    LAYOUT_PARSE_2 = re.compile(u"(.*?)[0-9]{1,2}.*")
#    GROUP = [u"ドド", u"レレ", u"ミミ", u"プリ", u"アイ", u"駆逐", u"キュア"]
    GROUP = [u"DMM", u"FGO", u"グラ", u"花", u"艦隊", u"城"]
    DELIMITER = ","

class PUNIKET(object):
    LAYOUT_PARSE_1 = re.compile(u"(.*?)[0-9]{1,2}.*")
    LAYOUT_PARSE_2 = re.compile(u"(.*?)[0-9]{1,2}.*")
#    GROUP = [u"ドド", u"レレ", u"ミミ", u"プリ", u"アイ", u"駆逐", u"キュア"]
#    GROUP = [u"ぷ", u"に", u"プリ", u"パラ", u"キュア", u"アイ", u"戦車", u"駆逐", u"グラ", u"FGO", u"けもの", u"なのは"]
    GROUP = [u"FGO", u"アズ", u"キュア", u"けもの", u"なの", u"ぷに", u"プリ", u"駆逐", u"戦車"]
    DELIMITER = ","

class LYRICALMAGICAL(object):
    LAYOUT_PARSE_1 = re.compile(u"(.*?)[0-9]{1,2}.*")
    LAYOUT_PARSE_2 = re.compile(u"(.*?)[0-9]{1,2}.*")
    GROUP = [u"なの"]
    #GROUP = [u"な", u"の", u"は"]
    DELIMITER = "\t"

class GAMEMARKET(object):
    LAYOUT_PARSE_1 = re.compile(u"([^0-9]*)[0-9]{1,2}")
    LAYOUT_PARSE_2 = re.compile(u"([^0-9]*)[0-9]{1,2}-[0-9]{1,2}")
    GROUP = [v for v in u"ABCDEFGHIJKLMNOPQRS"] + [u"特設"]
    DELIMITER = "\t"

class UTAHIME(object):
    LAYOUT_PARSE_1 = re.compile(u"(.*?)[0-9]{1,2},[0-9]{1,2}")
    LAYOUT_PARSE_2 = re.compile(u"(.*?)[0-9]{1,2}")
    GROUP = [u"歌", u"姫", u"ミリ", u"シ", u"ン", u"デ", u"レ", u"ラ", u"メモ", u"幸子", u"蘭子", u"アナ", u"唯", u"晴"]
    DELIMITER = ","

class PRDX(object):
    LAYOUT_PARSE_1 = re.compile(u"(.*?)[0-9]{1,2}・[0-9]{1,2}")
    LAYOUT_PARSE_2 = re.compile(u"(.*?)[0-9]{1,2}")
    GROUP = [u"ブラック", u"アクア", u"マーメイド"]
    DELIMITER = ","

class COMITIA(object):
    LAYOUT_PARSE_1 = re.compile(u"(.*?)[0-9]{1,2}")
    LAYOUT_PARSE_2 = re.compile(u"(.*?)[0-9]{1,2}")
#    GROUP = u"ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ"
#    GROUP = u"あいうえおかきくけこさしすせそたち"
    GROUP = u"展"
    DELIMITER = "\t"

class DENEN(object):
    LAYOUT_PARSE_1 = re.compile(u"(.*?)[0-9]{1,2}.*")
    LAYOUT_PARSE_2 = re.compile(u"(.*?)[0-9]{1,2}.*")
    GROUP = [u"田園"]

class HOURAIGEKISEN(object):
#    LAYOUT_PARSE_1 = re.compile(u"(.*?)-[0-9]{1,2}.*")
#    LAYOUT_PARSE_2 = re.compile(u"(.*?)-[0-9]{1,2}.*")
    LAYOUT_PARSE_1 = re.compile(u"SP-No\\.(.*?)-[0-9]{1,2}.*")
    LAYOUT_PARSE_2 = re.compile(u"SP-No\\.(.*?)-[0-9]{1,2}.*")
    GROUP = u"あかきくけこさしすせそたぬねのはひふへほまみむめ"
    DELIMITER = "\t"

class PUV(object):
    LAYOUT_PARSE_1 = re.compile(u"SP-No\\.(.*?)-[0-9]{1,2}.*")
    LAYOUT_PARSE_2 = re.compile(u"SP-No\\.(.*?)-[0-9]{1,2}.*")
    GROUP = u"あいうえおか"
    DELIMITER = "\t"

class SUNRISE_C(object):
    LAYOUT_PARSE_1 = re.compile(u"SP-No\\.(.*?)-[0-9]{1,2}.*")
    LAYOUT_PARSE_2 = re.compile(u"SP-No\\.(.*?)-[0-9]{1,2}.*")
    GROUP = u"ABCDEFGHIJKL"
    DELIMITER = "\t"

class KOBE_KANCOLLE(object):
    LAYOUT_PARSE_1 = re.compile(u"(.*?)[0-9]{1,2}.*")
    LAYOUT_PARSE_2 = re.compile(u"(.*?)[0-9]{1,2}.*")
    GROUP = [
        u"海岸通",
        u"居留地", u"生田川",
        u"錨山",
        u"市章山",
        u"北野", u"布引", u"摩耶山",
        u"甲山", u"六甲山"
        ]
    DELIMITER = ","

class SOUGETSUSAI(object):
    LAYOUT_PARSE_1 = re.compile(u"SP-No\\.(.*?)-[0-9]{1,2}.*")
    LAYOUT_PARSE_2 = re.compile(u"SP-No\\.(.*?)-[0-9]{1,2}.*")
    GROUP = u"A"
    DELIMITER = "\t"

class MOUNANIMOKOWAKUNAI(object):
    LAYOUT_PARSE_1 = re.compile(u"SP-No\\.(.*?)-[0-9]{1,2}.*")
    LAYOUT_PARSE_2 = re.compile(u"SP-No\\.(.*?)-[0-9]{1,2}.*")
    GROUP = u"APU"
    DELIMITER = "\t"

class SHT(object):
    LAYOUT_PARSE_1 = re.compile(u"(.*?)[0-9]{1,2},[0-9]{1,2}")
    LAYOUT_PARSE_2 = re.compile(u"(.*?)[0-9]{1,2}")
    GROUP = [
        u"円環", u"マミ", u"探偵", u"うん", u"スト", u"キュア",
        u"咲", u"ルカ", u"ミク", u"電磁", u"プリ", u"みれぃ", u"戦車", u"愛里寿",
        u"なの", u"うさぎ", u"勇者", u"絶唱",
        u"アイ", u"晴風", u"リル", u"鬼", u"祝福", u"マジ", u"卓球", u"小林",
        u"バンド", u"けもの", u"魔法", u"エロ", u"AI", u"みつご", u"ヒミツ", u"SHT"
    ]
    DELIMITER = ","

CONF = LYRICALMAGICAL


def custom_sort(d):
    v = re.search("-([0-9]{1,2})", d["layout"])
    return int(v.group(1))

#def (dictLayout):
def circle_list(dictLayout):

    nGrp = 0
    nIndex = 1

    listGrp = []
    for s in CONF.GROUP:
        listGrp.append(
            '{"id": "%d", "name": "%s"}' % (nGrp, s)
        )
        nGrp += 1

    print(",\n".join(listGrp).encode("utf-8"))

    nGrp  = 0
    for k in CONF.GROUP:

        #print dictLayout.keys()
        try:
            listItem = dictLayout[k.encode("utf-8")]
        except KeyError:
            print("KeyError", k)
            for key in dictLayout.keys():
                print(key, k.encode("utf-8"))
            sys.exit(1)

        listBuffer = []
        nIndexLocal = 1

#        for o in listItem:
        for o in sorted(listItem, key=lambda obj: obj["layout"]):
#        for o in sorted(listItem, key=custom_sort):
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
        print(exportBuffer)


def parse_layout(s):

    oCResult = CONF.LAYOUT_PARSE_1.search(s)
    if oCResult is None:
        oCResult = CONF.LAYOUT_PARSE_2.search(s)
        if oCResult is None:
            print("paser_layout error", s)
            sys.exit(-1)

    return(oCResult.group(1))


def search_twitter_screen_name(db_circlecheck_uinfo, screen_name):

    list_user = db_circlecheck_uinfo.view(
        "user/screen_name",
        wrapper=None,
        reduce=False,
        group=False,
        descending=False,
        include_docs=False,
        start_key=[screen_name, ""],
        end_key=[screen_name, "Z"]
    )

    if len(list_user) == 1:
        for r in list_user:
            return {
                "twitter_screen_name": r.key[0].encode("utf-8"),
                "twitter_user_id": r.key[1].encode("utf-8")
            }

    return None


def main():


    # CouchDB
    conn_couch = couchdb.Server(
        "http://" + configure.COUCH_USER + ":" + configure.COUCH_PASS + "@" + configure.COUCH_HOST
    )

    # CouchDB get tweets
    db_circlecheck_uinfo = conn_couch["circlecheck_uinfo"]

    #
    dictLayout = {}

#            dict_result = {
#                "twitter_screen_name": screen_name,
#                "twitter_user_id": search_result.group(1)
#            }

    with open(sys.argv[1], "r") as hFile:
        oCReader = csv.reader(hFile, delimiter=CONF.DELIMITER)

        for r in oCReader:
            dictRecord = {
                "circle_list": {}
            }
            strLayoutBlock = ""

            r += ["", "", "", "", "", ""]
            for idx, kwd in ((0, "layout"), (1, "circle"), (2, "writer"), (3, "url"), (4, "twitter"), (5, "pixiv")):

                s = r[idx].strip()

                if s != u"　" and len(s) > 0:
                    o_re = re.search("https?:\\/\\/twitter.com\\/(.*)", s)
                    if o_re is not None:
                        kwd = "twitter"
                        dict_result = search_twitter_screen_name(db_circlecheck_uinfo, o_re.group(1))
                        if dict_result is not None:
                            for k, v in dict_result.items():
                                dictRecord["circle_list"][k] = v
                    if re.search("https?:\\/\\/www.pixiv.net\\/member.php\\?.+", s):
                        kwd = "pixiv"
                    if re.search("https?:\\/\\/pixiv.me\\/(?!\\?).+", s):
                        kwd = "pixiv"
                    dictRecord["circle_list"][kwd] = s
            try:
                dictRecord["layout"] = dictRecord["circle_list"]["layout"]
            except KeyError:
                print(r, dictRecord)
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
