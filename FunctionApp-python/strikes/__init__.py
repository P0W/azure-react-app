import logging

from . import option_chain

import azure.functions as func
import json


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    symbol = req.params.get('symbol')
    cp = req.params.get('cp')
    if not cp:
        cp = 7.5
    else:
        cp = float(cp)

    if symbol:
        response = option_chain.get_strikes(symbol, cp)
        response = json.dumps(response, indent=3)
        return func.HttpResponse(
            response,
            status_code=200,
            headers={
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": "false",
            }
        )
    else:
        return func.HttpResponse(
             "Pass a symbol (NIFTY,BANKNIFTY,FINNIFTY) and closest preminum price in the query string ",
             status_code=200
        )
