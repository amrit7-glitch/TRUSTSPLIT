import crypto from "crypto";
import { TradeLog } from "../model/tradelog.model.js";

// generate SHA-256 hash of a block
export const generateHash = (blockIndex, timestamp, tradeData, previousHash) => {
    const data = `${blockIndex}${timestamp}${JSON.stringify(tradeData)}${previousHash}`;
    return crypto.createHash("sha256").update(data).digest("hex");
};

// add new block to chain
export const addBlock = async (tradeData) => {
    // get last block
    const lastBlock = await TradeLog.findOne().sort({ blockIndex: -1 });

    const blockIndex    = lastBlock ? lastBlock.blockIndex + 1 : 0;
    const previousHash  = lastBlock ? lastBlock.hash : "0000000000000000000000000000000000000000000000000000000000000000";
    const timestamp     = new Date();
    const hash          = generateHash(blockIndex, timestamp, tradeData, previousHash);

    const block = await TradeLog.create({
        blockIndex,
        timestamp,
        tradeData,
        previousHash,
        hash
    });

    return block;
};

// verify entire chain integrity
export const verifyChain = async () => {
    const blocks = await TradeLog.find().sort({ blockIndex: 1 });

    if (blocks.length === 0) return { valid: true, blocks: [] };

    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];

        // recalculate hash
        const recalculated = generateHash(
            block.blockIndex,
            block.timestamp,
            block.tradeData,
            block.previousHash
        );

        // check if hash matches
        if (recalculated !== block.hash) {
            return {
                valid: false,
                tampered: block.blockIndex,
                blocks
            };
        }

        // check if previousHash matches previous block
        if (i > 0 && block.previousHash !== blocks[i - 1].hash) {
            return {
                valid: false,
                tampered: block.blockIndex,
                blocks
            };
        }
    }

    return { valid: true, blocks };
};