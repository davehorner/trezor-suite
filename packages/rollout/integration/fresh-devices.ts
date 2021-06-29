/**
 * Kind of an e2e test. With real life releases.json, create snapshots and evaulate if we are happy with
 * what was offered.
 *
 * Find which fw should be offered for currently shipped T2 devices
 */

import { getInfo, getBinary } from '../src';
import { Release, VersionArray } from '../src/utils/parse';

const { getDeviceFeatures } = global.JestMocks;

const RELEASES_T2 = JSON.parse(process.env.RELEASES_T2) as Release[];
const RELEASES_T1 = JSON.parse(process.env.RELEASES_T1) as Release[];
const BASE_URL = process.env.BASE_FW_URL;
const BETA_BASE_URL = process.env.BETA_BASE_FW_URL;
// Tests are expected to fail whenever there is a new firmware update, since the last version is hardcoded.s
const latestVersion = [1, 10, 1] as VersionArray;

describe('Find firmware info for: ', () => {
    it('bootloader 1.0.0 -> firmware version 1.6.3', async () => {
        const info = getInfo({
            features: getDeviceFeatures({
                bootloader_mode: true,
                major_version: 1,
                minor_version: 0,
                patch_version: 0,
                firmware_present: false,
            }),
            releases: RELEASES_T1,
        });
        expect(info).toMatchObject({
            release: { version: latestVersion },
            latestSafe: { version: [1, 6, 3] },
            isSafe: false,
        });

        // validate that with binary returns the same firmware
        const withBinary = await getBinary({
            features: getDeviceFeatures({
                bootloader_mode: true,
                major_version: 1,
                minor_version: 0,
                patch_version: 0,
                firmware_present: false,
            }),
            version: [1, 6, 3],
            releases: RELEASES_T1,
            baseUrl: BASE_URL,
            baseUrlBeta: BETA_BASE_URL,
        });
        expect(withBinary).toMatchObject({
            release: { version: latestVersion },
            latestSafe: { version: [1, 6, 3] },
        });
    });

    it('bootloader 1.5.1 -> firmware version 1.10.0', async () => {
        const info = getInfo({
            features: getDeviceFeatures({
                bootloader_mode: true,
                major_version: 1,
                minor_version: 5,
                patch_version: 1,
                firmware_present: false,
            }),
            releases: RELEASES_T1,
        });
        expect(info).toMatchObject({ release: { version: latestVersion } });

        // validate that with binary returns the same firmware
        const withBinary = await getBinary({
            features: getDeviceFeatures({
                bootloader_mode: true,
                major_version: 1,
                minor_version: 5,
                patch_version: 1,
                firmware_present: false,
            }),
            version: latestVersion,
            releases: RELEASES_T1,
            baseUrl: BASE_URL,
            baseUrlBeta: BETA_BASE_URL,
        });
        expect(withBinary).toMatchObject({ release: { version: latestVersion } });
    });
});
