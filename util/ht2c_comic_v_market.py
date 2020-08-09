import sys
import re
import csv
import argparse
import logging
"""
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


#
def circle_info(s):

    strUrl = ""
    strCircle = ""

    oCRe = re.search("<a href=\"(.*?)\".*?>(.*?)</a>", s, re.I)

    if oCRe is not None:
        strUrl = oCRe.group(1)
        strCircle = oCRe.group(2)
    else:
        strCircle = s

    return strCircle, strUrl


#
def main():

    o_parser = argparse.ArgumentParser()
    o_parser.add_argument("-v",
                          "--verbose",
                          action="store_true",
                          required=False,
                          default=False)

    o_parser.add_argument("filename")

    o_argv = o_parser.parse_args()

    if o_argv.verbose is True:
        log_level = logging.DEBUG
    else:
        log_level = logging.INFO

    o_log = logging.getLogger(__name__)
    o_handler = logging.StreamHandler()
    o_handler.setLevel(log_level)
    o_log.setLevel(log_level)
    o_log.addHandler(o_handler)
    o_log.propagate = False

    with open(o_argv.filename, "r", encoding="utf-8") as f:
        text_html = f.read()

    list_circle = re.findall(
        '<div class="card">.*?<div class="card-left-link">.*?</div>.*?</div>',
        text_html, re.DOTALL)

    list_record = []
    for html_circle in list_circle:

        o_re = re.search(
            '<div class="card-right-no">.*?</div>'
            '.*?'
            '<div class="card-right-space">(.*?)</div>'
            '.*?'
            '<div class="card-left-description-small">.*?</div>'
            '.*?'
            '<div class="card-left-description-large">(.*?)</div>'
            '.*?'
            '<div class="card-left-description-small">.*?</div>'
            '.*?'
            '<div class="card-left-description-large">(.*?)</div>'
            '.*?'
            '<div class="card-left-link">(.*?)</div>', html_circle, re.DOTALL)

        if o_re is not None:
            list_value = [v.strip() for v in o_re.groups()]

            list_href = [
                v.strip() for v in re.findall('<a href="(.*?)"', list_value[3],
                                              re.DOTALL) if v.strip() != ''
            ]

            url = ""
            url_twitter = ""
            url_pixiv = ""

            for href in list_href:
                if href.find("pixiv") >= 0:
                    url_pixiv = href
                elif href.find("twitter") >= 0:
                    url_twitter = href
                else:
                    url = href

            list_record.append(list_value[0:3] + [url, url_twitter, url_pixiv])

    with open(o_argv.filename + ".csv", "w", encoding="utf-8") as f:
        csv_w = csv.writer(f)
        csv_w.writerows(list_record)
    """
    for strTableBody in listTable:
        listCircle = re.findall("<tr>(.*?)</tr>", strTableBody, re.I)

        for strCircle in listCircle:

            oCRe = re.search(
                "<td>(.*?)</td>.*?"
                "<td>(.*?)</td>.*?"
                "<td>(.*?)</td>.*?"
                "<td>(.*?)</td>.*?"
                "", strCircle, re.I)

            if oCRe != None:

                strWriter = ""
                strPixiv = ""

                strCircle, strUrl = circle_info(oCRe.group(1))
                strName, strTwitter = circle_info(oCRe.group(3))
                strSpace = oCRe.group(4)

                if strUrl.find("http://www.pixiv") >= 0:
                    strPixiv = strUrl
                    strUrl = ""
                if strUrl.find("https://twitter") >= 0:
                    strTwitter = strUrl
                    strUrl = ""
                if strUrl.find("http://twitter") >= 0:
                    strTwitter = strUrl
                    strUrl = ""

                print "\t".join([
                    strSpace, strCircle, strWriter, strUrl, strTwitter,
                    strPixiv
                ])


#                print oCRe.group(1)
    """


if __name__ == "__main__":
    main()

# [EOF]
