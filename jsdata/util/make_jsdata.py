# -*- coding: utf-8 -*-
##
import sys
import string
import csv
import json
import collections

#
COMITIA_A = u"ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ"
COMITIA_B = u"あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめも"
COMITIA_C = u"展"

dictLayout = {}

oCReader = csv.reader(open(sys.argv[1], "rb"), delimiter="\t")

for tplRecord in oCReader:

    dictRecord = {}
    # collections.OrderedDict()

    for idx, kwd in ((0, "layout"), (1, "circle"), (3, "writer"), (2, "url")):
        s = tplRecord[idx].strip().decode("utf-8")
        if(s != u"　" and len(s) > 0):
            dictRecord[kwd] = s

    strLayout_1 = tplRecord[2].strip()
    strLayout_2 = tplRecord[3].strip().replace("/", ",")

# dictRecord[ "url" ] = ""
# dictRecord[ "layout" ] = strLayout_1 + strLayout_2

    try:
        strLB = dictRecord["layout"][0]
    except:
        # print dictRecord
        pass

    # print strLB

    dictRecord = {"layout": dictRecord["layout"], "circle_list": dictRecord}
    del dictRecord["circle_list"]["layout"]

    if(strLB in dictLayout):
        dictLayout[strLB].append(dictRecord)
    else:
        dictLayout[strLB] = [dictRecord]


def check_key(v):
    x = int(v["layout"][1:].split(",")[0])
    return(x)


nIndex = 0

for k, listItem in dictLayout.items():
    # print k
    pass

# sys.exit()

for k in COMITIA_C:

    listItem = dictLayout[k]

    listBuffer = []
    # print k, type(listItem)

    for o in sorted(listItem, key=lambda obj: obj["layout"]):
        # listBuffer.append( "    " + json.dumps( o, ensure_ascii = False ) )
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

    # print "<!-- %s -->" % k.encode( "utf-8" )
    exportBuffer = ""
    exportBuffer += "\"%d\" : [\n" % (nIndex,)
    exportBuffer += ",\n".join(listBuffer)
    exportBuffer += "\n"
    exportBuffer += "],\n"

    print exportBuffer.encode("utf-8")

    nIndex += 1
    # pass

# for strLine in string.split( hFile.read(), "\n" ):

    # strCircle, strWriter, strUrl, strLayout, x	= string.split( strLine, "\t" )
    # print '{ "layout" : "%s", "circle" : "%s", "writer" : "%s", "url" : "%s" },' % ( strLayout, strCircle, strWriter, strUrl, )
