import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const fetch = require('node-fetch');
const sharp = require('sharp');

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const { query } = req;
    const { source, width, height } = query;

    context.log('HTTP trigger function starting processing a request.');
    context.log(source, width, height);

    const resizedImage = await fetch(source)
        .then(res => res.buffer())
        .then((response) => {
            context.log('FETCHED', response);
            context.log('isBuffer', Buffer.isBuffer(response));
            return sharp(response)
                .resize({
                    width: parseInt(width, 10),
                    height: parseInt(height, 10),
                    fit: 'cover'
                })
                .webp({ lossless: true })
                .toBuffer();
        });

        context.log(resizedImage);

    context.log('HTTP trigger function processed a request.');

    if (resizedImage) {
        context.res = {
            body: resizedImage.toString('base64'),
        };
    } else {
        context.res = {
            status: 400,
            body: "Something went wrong"
        };
    }
};

export default httpTrigger;
