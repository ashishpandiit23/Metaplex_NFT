"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var anchor = require("@project-serum/anchor");
var spl_token_1 = require("@solana/spl-token");
// const { assert } = require('chai');
var _a = anchor.web3, PublicKey = _a.PublicKey, Keypair = _a.Keypair, Connection = _a.Connection;
var _b = require("../helpers/token"), createMint = _b.createMint, createTokenAccount = _b.createTokenAccount, getTokenAccount = _b.getTokenAccount, TokenInstructions = _b.TokenInstructions, airDropSol = _b.airDropSol;
var EDITION_MARKER_BITSIZE = 248;
var testNftTitle = "Beta";
var testNftSymbol = "BETA";
var testNftUri = "https://raw.githubusercontent.com/Coding-and-Crypto/Solana-NFT-Marketplace/master/assets/example.json";
var con = new Connection("https://api.devnet.solana.com");
describe('nft', function () {
    var provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    var program = anchor.workspace.Registry1;
    var mint = null;
    var to = null;
    var baseAccount = anchor.web3.Keypair.fromSecretKey(new Uint8Array([138, 253, 109, 251, 227, 46, 244, 140, 133, 39, 76, 0, 141, 255, 37, 14, 135, 5, 208, 177, 152, 227, 231, 164, 236, 48, 194, 205, 140, 222, 104, 166, 64, 29, 26, 129, 148, 38, 131, 228, 221, 63, 81, 77, 176, 188, 255, 81, 167, 72, 94, 54, 108, 241, 49, 124, 95, 61, 211, 123, 8, 129, 5, 45]));
    var tokenMetadataProgram = new anchor.web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
    var metadata = null;
    var masterEdition = null;
    var bump = null;
    it('inits', function () { return __awaiter(void 0, void 0, void 0, function () {
        var acc, check, program_id, idl, program_new, test;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    acc = new anchor.web3.PublicKey("CymenLYyH5YAJLJA5yfPnYRbguWvvQ2p1P7G6vWeL9bh");
                    return [4 /*yield*/, con.getAccountInfo(acc)];
                case 1:
                    check = _c.sent();
                    program_id = new anchor.web3.PublicKey("8cosvg14TAARx4rdECCSJueosqMRY8mhRWu7m5oVGDj8");
                    idl = JSON.parse(require("fs").readFileSync("./target/idl/registry1.json", "utf8"));
                    program_new = new anchor.Program(idl, program_id);
                    return [4 /*yield*/, program_new.account.masterEdition.fetch(acc)];
                case 2:
                    test = _c.sent();
                    console.log("test acc", acc.toString());
                    return [4 /*yield*/, program_new.account.newEdition.fetch(acc.toString())];
                case 3:
                    _c.sent();
                    console.log("test=", test);
                    console.log("value of check ", check.data);
                    process.exit(1);
                    return [4 /*yield*/, createMint(provider, baseAccount.publicKey)];
                case 4:
                    mint = _c.sent();
                    return [4 /*yield*/, createTokenAccount(provider, mint, baseAccount.publicKey)];
                case 5:
                    to = _c.sent();
                    return [4 /*yield*/, PublicKey.findProgramAddress([
                            Buffer.from('metadata'),
                            tokenMetadataProgram.toBytes(),
                            mint.toBytes()
                        ], tokenMetadataProgram)];
                case 6:
                    _a = _c.sent(), metadata = _a[0], bump = _a[1];
                    return [4 /*yield*/, PublicKey.findProgramAddress([
                            Buffer.from('metadata'),
                            tokenMetadataProgram.toBytes(),
                            mint.toBytes(),
                            Buffer.from('edition'),
                        ], tokenMetadataProgram)];
                case 7:
                    _b = _c.sent(), masterEdition = _b[0], bump = _b[1];
                    return [2 /*return*/];
            }
        });
    }); });
    it('Creates nft!', function () { return __awaiter(void 0, void 0, void 0, function () {
        var tx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("mint address", mint.toString());
                    console.log("to ", to.toString());
                    console.log("metadata ", metadata.toString());
                    console.log("masterEdition ", masterEdition.toString());
                    console.log("baseAccount.publicKey ", baseAccount.publicKey.toString());
                    return [4 /*yield*/, program.methods.mintNft(mint, testNftUri, testNftTitle, testNftSymbol)
                            .accounts({
                            mintAuthority: baseAccount.publicKey,
                            mint: mint,
                            tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
                            metadata: metadata,
                            tokenMetadataProgram: tokenMetadataProgram,
                            tokenAccount: to,
                            payer: baseAccount.publicKey,
                            systemProgram: anchor.web3.SystemProgram.programId,
                            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                            masterEdition: masterEdition
                        }).signers([baseAccount])
                            .rpc()];
                case 1:
                    tx = _a.sent();
                    console.log("Your transaction signature", tx);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Mints edition!', function () { return __awaiter(void 0, void 0, void 0, function () {
        var newMint, newTo, edition, editionNum, _a, newMetadata, bump1, _b, newEdition, bump2, _c, mark, bump3, mint_tx, res, tx;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, createMint(provider, baseAccount.publicKey)];
                case 1:
                    newMint = _d.sent();
                    return [4 /*yield*/, createTokenAccount(provider, newMint, baseAccount.publicKey)];
                case 2:
                    newTo = _d.sent();
                    edition = new anchor.BN(5);
                    editionNum = Math.floor(edition / EDITION_MARKER_BITSIZE);
                    return [4 /*yield*/, PublicKey.findProgramAddress([
                            Buffer.from('metadata'),
                            tokenMetadataProgram.toBytes(),
                            newMint.toBytes()
                        ], tokenMetadataProgram)];
                case 3:
                    _a = _d.sent(), newMetadata = _a[0], bump1 = _a[1];
                    return [4 /*yield*/, PublicKey.findProgramAddress([
                            Buffer.from('metadata'),
                            tokenMetadataProgram.toBytes(),
                            newMint.toBytes(),
                            Buffer.from('edition'),
                        ], tokenMetadataProgram)];
                case 4:
                    _b = _d.sent(), newEdition = _b[0], bump2 = _b[1];
                    return [4 /*yield*/, PublicKey.findProgramAddress([
                            Buffer.from('metadata'),
                            tokenMetadataProgram.toBytes(),
                            mint.toBytes(),
                            Buffer.from('edition'),
                            Buffer.from(editionNum.toString()),
                        ], tokenMetadataProgram)];
                case 5:
                    _c = _d.sent(), mark = _c[0], bump3 = _c[1];
                    mint_tx = new anchor.web3.Transaction().add(
                    // Fire a transaction to create our mint account that is controlled by our anchor wallet
                    (0, spl_token_1.createMintToInstruction)(newMint, newTo, baseAccount.publicKey, 1, [], spl_token_1.TOKEN_PROGRAM_ID));
                    return [4 /*yield*/, anchor.AnchorProvider.env().sendAndConfirm(mint_tx, [baseAccount])];
                case 6:
                    res = _d.sent();
                    console.log("mint address", newMint.toString());
                    console.log("to ", newTo.toString());
                    console.log("metadata ", newMetadata.toString());
                    console.log("masterEdition ", newEdition.toString());
                    console.log("baseAccount.publicKey ", baseAccount.publicKey.toString());
                    return [4 /*yield*/, program.methods.mintEditionFromMaster(edition).accounts({
                            editionMark: mark,
                            newMetadata: newMetadata,
                            newEdition: newEdition,
                            newMint: newMint,
                            newTokenAccount: newTo,
                            newMintAuthority: baseAccount.publicKey,
                            tokenMetadataProgram: tokenMetadataProgram,
                            metadata: metadata,
                            metadataMint: mint,
                            newMetadataUpdateAuthority: baseAccount.publicKey,
                            masterEdition: masterEdition,
                            payer: baseAccount.publicKey,
                            tokenAccountOwner: baseAccount.publicKey,
                            tokenAccount: to,
                            systemProgram: anchor.web3.SystemProgram.programId,
                            tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
                            rent: anchor.web3.SYSVAR_RENT_PUBKEY
                        }).signers([baseAccount]).rpc()];
                case 7:
                    tx = _d.sent();
                    console.log("Your transaction signature", tx);
                    return [2 /*return*/];
            }
        });
    }); });
});
