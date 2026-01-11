import { fetchInscriptionMetadataFromSeeds, findMintInscriptionPda, tplInscription } from "@trezoaplex-foundation/tpl-inscription";
import { PublicKey } from "@trezoaplex-foundation/umi";
import { createUmi } from "@trezoaplex-foundation/umi-bundle-defaults";
import { writeFileSync } from "fs";
import pMap from "p-map";

export async function fetchInscriptionsByMint(rpc: string, mints: PublicKey[], concurrency: number, output: string) {
    const umi = createUmi(rpc);
    umi.use(tplInscription());

    const inscriptionMetadataAccounts = await pMap(mints, async (mint) => {
        const mintInscription = findMintInscriptionPda(umi, { mint });
        const inscriptionMetadata = await fetchInscriptionMetadataFromSeeds(umi, { inscriptionAccount: mintInscription[0] });
        delete inscriptionMetadata["header"];
        delete inscriptionMetadata["padding"];
        return inscriptionMetadata;
    }, { concurrency });

    inscriptionMetadataAccounts.sort((a, b) => {
        if (a.inscriptionRank < b.inscriptionRank) {
            return -1;
        }
        if (a.inscriptionRank > b.inscriptionRank) {
            return 1;
        }
        return 0;
    });

    writeFileSync(output, JSON.stringify([...inscriptionMetadataAccounts], (key, value) =>
        typeof value === 'bigint'
            ? value.toString()
            : value,
        2));
}