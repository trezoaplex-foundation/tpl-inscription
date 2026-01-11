import { createUmi } from "@trezoaplex-foundation/umi-bundle-defaults";
import { loadWalletKey } from "../../utils.js";
import { tplInscription, createShard, findInscriptionShardPda, safeFetchInscriptionShard } from "@trezoaplex-foundation/tpl-inscription";

export async function create_shards(str: any, options: any) {
    const { rpc, keypair } = options.opts();

    let umi = createUmi(rpc);
    umi = loadWalletKey(umi, keypair);
    umi.use(tplInscription());

    for (let shardNumber = 0; shardNumber < 32; shardNumber++) {
        const shardAccount = findInscriptionShardPda(umi, { shardNumber });

        // Check if the account has already been created.
        let shardData = await safeFetchInscriptionShard(umi, shardAccount);

        if (!shardData) {
            console.log(`Creating shard ${shardNumber}...`);
            await createShard(umi, {
                shardAccount,
                shardNumber,
            }).sendAndConfirm(umi, { confirm: { commitment: 'confirmed' } });
        } else {
            console.log(`Shard ${shardNumber} already exists.`);
        }
    }
}