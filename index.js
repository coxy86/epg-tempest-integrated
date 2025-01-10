import fs from 'fs';
import xml2js from 'xml2js';

const parseXml = (xml) => {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xml, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

const initialize = async () => {
    const guidePath = './epg-grabber/guide.xml'
    let guideData
    try {
        const xmlData = await fs.promises.readFile(guidePath, 'utf-8')
        guideData = await parseXml(xmlData);
    } catch (e) {
        console.error(`Unable to process ${guidePath}`, e)
        throw e
    }

    const tempestPath = './tempest/epg/foxtel.xml'
    let tempestData
    try {
        const xmlData = await fs.promises.readFile(tempestPath, 'utf-8')
        tempestData = await parseXml(xmlData);
    } catch (e) {
        console.error(`Unable to process ${guidePath}`, e)
        throw e
    }

    return [guideData, tempestData]
}

const findInTempest = (channel, title, tempest) => {
    return tempest.tv.programme.find(p => ('desc' in p && p.title[0]._ === title && p.$.channel === channel))
}

const merge = async (guide, tempest) => {
    guide.tv.programme = guide.tv.programme.map(p => {
        if (!('desc' in p)) {
            console.log(`Description not found for "${p.title[0]._}"`)
            const channel = p.$.channel
            const title = p.title[0]._

            const tempestDescription = findInTempest(channel, title, tempest)
            if (tempestDescription) {
                p.desc = tempestDescription.desc
            }
        }
        return p
    })

    const builder = new xml2js.Builder()
    const updatedXml = builder.buildObject(guide)
    await fs.promises.writeFile('./epg-grabber/epg/guidefinal.xml', updatedXml)

}

let [guide, tempest] = await initialize()
merge(guide, tempest)