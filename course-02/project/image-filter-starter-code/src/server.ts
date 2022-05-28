import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {
  // Init the Express application
  const app = express();
  // const UrlPattern = require('url-pattern');
  // const pattern = new UrlPattern('');
  // const pattern = new UrlPattern(
  //   '[http[s]!://][$sub_domain.]$domain.$toplevel-domain[/?]'
  // );
  // Set the network por
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  app.use('/filteredimage', async (req: Request, resp: Response) => {
    const image_url: string = req.query.image_url;

    try {
      console.log('TRY REACHED');
      // check image_url is in query param
      if (!image_url) {
        return resp.status(400).json({
          errorCode: 400,
          message: 'URL is missing. Please provide a valid image url.',
        });
      }

      // filter the image
      const filterImagePath: string = await filterImageFromURL(image_url);
      resp.sendFile(filterImagePath, (err) => {
        if (err) {
          return resp.status(503).json({
            errorCode: 503,
            message:
              'Something went wrong while processing your request. Please try again later.',
          });
        }
        // delete the filter image from tmp directory
        deleteLocalFiles([filterImagePath]);
      });
    } catch (error) {
      return resp.status(422).json({
        errorCode: 422,
        message: 'Image is not processable. Please try with a valid image url.',
      });
    }
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get('/', async (req, res) => {
    res.send('try GET /filteredimage?image_url={{}}');
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
