import requests
import json


## Retrieve Option Chain from NSE India Website
def get_option_chain(symbol):
    baseurl = "https://www.nseindia.com/"
    url = "https://www.nseindia.com/api/option-chain-indices?symbol=%s" % (symbol)
    headers = {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, "
        "like Gecko) "
        "Chrome/80.0.3987.149 Safari/537.36",
        "accept-language": "en,gu;q=0.9,hi;q=0.8",
        "accept-encoding": "gzip, deflate, br",
    }
    session = requests.Session()
    request = session.get(baseurl, headers=headers, timeout=5)
    cookies = dict(request.cookies)
    response = session.get(url, headers=headers, timeout=5, cookies=cookies)
    option_chain = response.json()
    return option_chain


## Convert to Http Get Method
def get_expiry_dates(symbol):
    option_chain = get_option_chain(symbol)
    return option_chain["records"]["expiryDates"]


## Convert to Http Get Method
def get_strikes(symbol, cp):
    option_chain = get_option_chain(symbol)
    latest_expiry = option_chain["records"]["expiryDates"][0]

    def process(data):
        if data["expiryDate"] == latest_expiry:
            return {
                "strike": data["strikePrice"],
                "ce": data["CE"]["lastPrice"],
                "pe": data["PE"]["lastPrice"],
            }
        return None

    strikes = map(process, option_chain["records"]["data"])
    ## filter 0 ltp strikes and x is not None
    strikes = filter(lambda x: x and (x["ce"] != 0 and x["pe"] != 0), strikes)

    strikes = list(strikes)
    strikes = sorted(strikes, key=lambda x: x["strike"])
    ## find the strike where the difference between ce and pe is minimum
    atm_strike = min(strikes, key=lambda x: abs(x["ce"] - x["pe"]))

    ## find the ce strike which has minimum difference between ltp and cp
    ce_strike = min(strikes, key=lambda x: abs(x["ce"] - cp))
    ## find the pe strike which has minimum difference between ltp and cp
    pe_strike = min(strikes, key=lambda x: abs(x["pe"] - cp))

    return {
        "expiry": latest_expiry,
        "strikes": [
            {
                "group": "straddle",
                ## all entries of straddle
                "ceLtp": atm_strike["ce"],
                "peLtp": atm_strike["pe"],
                "ceStrike": atm_strike["strike"],
                "peStrike": atm_strike["strike"],
            },
            {
                "group": "strangle",
                ## all entries of strangle
                "ceLtp": ce_strike["ce"],
                "peLtp": pe_strike["pe"],
                "ceStrike": ce_strike["strike"],
                "peStrike": pe_strike["strike"],
            },
        ],
        "cp": cp,
        "symbol": symbol,
    }
