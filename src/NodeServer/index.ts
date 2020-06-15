import express = require("express");
import cors = require("cors");
import bodyParser = require("body-parser");
import {
  getTimeDictAboutKeywordObjectDict,
  getNewRelatedKeywordsInTotalTime,
  getTimeDictAboutRelatedKeywordObjectDictInEachTime,
  getKeywordObjectDictTotalTime,
  getRelatedKeywordsInTime, getRelatedKeywordsForSpv, getRelatedKeywordsForSpvInUpgrade,
} from "./processFunctions";
import {
  QueryKeyword,
  RelatedKeywordObject,
  RelatedKeywordObjectDict,
  TimeDictAboutRelatedKeywordObjectDict,
  KeywordObject, CombinationOfRelatedKeywordsTotalTime, CombinationOfRelatedKeywords,
} from "./refiningInterfaces";
import _ from "lodash";

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello World! Node server");
});

app.get(
  "/time-dict-about-keyword-object-dict",
  (req: express.Request, res: express.Response) => {
    const timeDictAboutKeywordObjectDict = getTimeDictAboutKeywordObjectDict();
    res.send(timeDictAboutKeywordObjectDict);
  }
);


/**
 * by mainViz search
 */
app.post(
  "/related-keywords",
  (
    req: express.Request<any, any, string[], any>,
    res: express.Response
  ) => {
    const queryKeywords: string[] = req.body;
    console.log("related-keywords req!", queryKeywords);
    const keywordObjectDictTotalTime = getKeywordObjectDictTotalTime();

    const results = _.map<string, CombinationOfRelatedKeywordsTotalTime>(queryKeywords, queryKeyword => {
      const queryKeywordObject = keywordObjectDictTotalTime[queryKeyword];
      const relatedKeywordObjectDictInTotalTime: RelatedKeywordObjectDict = getNewRelatedKeywordsInTotalTime(
        queryKeyword
      );
      const timeDictAboutRelatedKeywordObjectDict: TimeDictAboutRelatedKeywordObjectDict = getTimeDictAboutRelatedKeywordObjectDictInEachTime(
        queryKeyword
      );

      return {
        queryKeywordObject,
        relatedKeywordObjectDictInTotalTime,
        timeDictAboutRelatedKeywordObjectDict,
      }
    })


    // send top k documents. this can be done by flask server.

    res.send(results);
  }
);


/**
 * 1) clicked WordStream keyword or 2) in time, clicked network keyword
 */
app.post(
  "/related-keywords-in-time",
  (
    req: express.Request<any, any, KeywordObject[], any>,
    res: express.Response
  ) => {
    const queryKeywordObjects = req.body;

    const combinationsOfRelatedKeywords =
      _.map<KeywordObject, CombinationOfRelatedKeywords>(queryKeywordObjects, queryKeywordObject => {
        const relatedKeywordObjectDictInTime
          = getRelatedKeywordsInTime(
          queryKeywordObject,
          queryKeywordObject.yearMonth as string
        );

        return {
          queryKeywordObject,
          relatedKeywordObjectDict: relatedKeywordObjectDictInTime
        }
      })


    // send top k documents. this can be done by flask server.
    res.send(combinationsOfRelatedKeywords);
  }
);


/**
 * For SearchProcessVisualization
 */
// app.post('/related-keywords-fast-for-spv',
//   (
//     req: express.Request<any, any, string[], any>,
//     res: express.Response
//   ) => {
//     const queryKeywords = req.body;
//     const children = getRelatedKeywordsForSpv(queryKeywords[0]);
//
//     res.send(children);
//   });

app.post('/related-keywords-fast-for-spv',
  (
    req: express.Request<any, any, string[], any>,
    res: express.Response
  ) => {

    const queryKeywords = req.body;
    console.log('queryKeywords', queryKeywords)

    const currentQueryKeyword = queryKeywords.pop();

    const children = getRelatedKeywordsForSpvInUpgrade(
      currentQueryKeyword as string, queryKeywords);

    res.send(children);
  });


app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
