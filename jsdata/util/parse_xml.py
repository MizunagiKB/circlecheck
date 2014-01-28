# -*- coding: utf-8 -*-
import sys
import xml.sax
import xml.sax.handler
import string



class CHandler(xml.sax.handler.ContentHandler):

    def startDocument(self):
        self.m_bCircle = False
        self.m_listItem = []

    def startElement(self, tag, attrs):
        if(tag == "TR"):
            self.m_bCircle = True
            self.m_listItem = []
#        elif(tag == "TD"):
#            self.m_listItem = []
        elif(tag == "A"):
#            print attrs[u"href"]
#            sys.exit()
            if("name" not in attrs):
                self.m_listItem.append(attrs["href"].strip()[len("http://www.creation.gr.jp/jump/?"):])

    def endElement(self, tag):
        if(tag == "TR"):
            self.m_bCircle = False
#            print len(self.m_listItem), self.m_listItem
            if(len(self.m_listItem) == 13):
                listBuffer = [
                    self.m_listItem[5],
                    self.m_listItem[8],
                    "",
                    self.m_listItem[2]
                ]
            elif(len(self.m_listItem) == 14):
                listBuffer = [
                    self.m_listItem[5],
                    self.m_listItem[8],
                    self.m_listItem[11],
                    self.m_listItem[2]
                ]
            else:
                listBuffer = []

            if(len(listBuffer) > 0):
                print string.join(listBuffer, ",").encode("utf-8")

            self.m_listItem = []

    def characters(self, strBuffer):
        if(self.m_bCircle == True):
            strBuffer = strBuffer.strip()
            self.m_listItem.append(strBuffer)


def main():

    with open(sys.argv[1], "rb") as hFile:
        strBuffer = hFile.read()
        strBuffer = strBuffer.replace("&times;", "×")
        strBuffer = strBuffer.replace("&nbsp;", " ")
        strBuffer = strBuffer.replace("&rsquo;", "’")
        strBuffer = strBuffer.replace("&radic;", "√")
        strBuffer = strBuffer.replace("&rarr;", "→")
        strBuffer = strBuffer.replace("&Delta;", "Δ")

        oCHandler = CHandler()
        xml.sax.parseString(strBuffer, oCHandler)



if(__name__ == "__main__"):
    main()
