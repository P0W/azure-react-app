import logging
from . import option_chain

import azure.functions as func
import json

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    symbol = req.params.get('symbol')
    if symbol:
        ## get expiry dates
        expiry_dates = option_chain.get_expiry_dates(symbol)
        ## convert to json
        expiry_dates = json.dumps(expiry_dates, indent=3)
        return func.HttpResponse(
            expiry_dates,
            status_code=200,
            headers={
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": "false",
            }
        )

    else:
        return func.HttpResponse(
             "Pass a symbol (NIFTY,BANKNIFTY,FINNIFTY) in the query string.",
             status_code=200
        )
