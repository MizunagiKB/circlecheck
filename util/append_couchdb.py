# -*- coding: utf-8 -*-
import sys
import couchdb
import json
import os

def convpath(_s):
    if(_s == "#"):
        return("#")
    else:
        s = _s.split("/")[-1]
        return("/db/circlecheck/" + os.path.splitext(s)[0])

def main():
    oCCouch = couchdb.Server("http://MizunagiKB:gigax68k@127.0.0.1:5984/")
    oCDB = oCCouch["circlecheck"]

    s = os.path.splitext(sys.argv[1])[0]

    try:
        data = oCDB[s]
        print "ERR"
        sys.exit(0)
    except couchdb.http.ResourceNotFound:
        with open(sys.argv[1], "rb") as hFile:
            data = json.loads(hFile.read())

    data["_id"] = s
    data["EVENT_SERIES"] = sys.argv[2]

    data["DATA_SOURCE"] = convpath(data["DATA_SOURCE"])
    data["DATA_SOURCE_PREV"] = convpath(data["DATA_SOURCE_PREV"])
    data["DATA_SOURCE_NEXT"] = convpath(data["DATA_SOURCE_NEXT"])

    oCDB.save(data)


if(__name__ == "__main__"):
    main()
