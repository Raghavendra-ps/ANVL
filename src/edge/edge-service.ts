import * as http from 'http';
const config = require('../config/edge/edge_config.yml');

// Install type definitions for node
async function main() {
    const server = http.createServer((req: any, res: any) => {
        // res.statusCode = 200;
        // res.setHeader('Content-Type', 'text/plain');
        // res.write('ANVIL Edge Node Service\n');
        // res.end();
    });

    server.listen(config.toll_booth_id, () => {
        console.log(`Edge node running on port ${config.toll_booth_id}`);
    });

    // Vehicle detection loop
    setInterval(async () => {
        // await detectVehicles();
        // await extractLicensePlates();
        // await inferVehicleAttributes();
    }, config.detection_interval * 1000);
}

main().catch(console.error);