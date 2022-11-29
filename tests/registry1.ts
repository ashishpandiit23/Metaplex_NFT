import * as anchor from "@project-serum/anchor";
import { Program, Wallet } from '@project-serum/anchor'
import { Registry1 } from "../target/types/registry1";
import {
  TOKEN_PROGRAM_ID,
  createMintToInstruction
} from "@solana/spl-token";
import { connection } from "@project-serum/common";
// const { assert } = require('chai');

const { PublicKey, Keypair,Connection } = anchor.web3;

const { 
  createMint, 
  createTokenAccount,
  getTokenAccount,
  TokenInstructions,
  airDropSol,
} = require("../helpers/token");

const EDITION_MARKER_BITSIZE = 248;
const testNftTitle = "Beta";
const testNftSymbol = "BETA";
const testNftUri = "https://raw.githubusercontent.com/Coding-and-Crypto/Solana-NFT-Marketplace/master/assets/example.json";

const con = new Connection("https://api.devnet.solana.com");

describe('nft', () => {

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Registry1 as Program<Registry1>;

  let mint = null;
  let to = null;

  let baseAccount = anchor.web3.Keypair.fromSecretKey(new Uint8Array([138,253,109,251,227,46,244,140,133,39,76,0,141,255,37,14,135,5,208,177,152,227,231,164,236,48,194,205,140,222,104,166,64,29,26,129,148,38,131,228,221,63,81,77,176,188,255,81,167,72,94,54,108,241,49,124,95,61,211,123,8,129,5,45]));

  let tokenMetadataProgram = new anchor.web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

  let metadata = null;
  let masterEdition = null;
  let bump = null;

  it('inits', async () => {


    

    mint = await createMint(provider, baseAccount.publicKey);

    to = await createTokenAccount(provider, mint, baseAccount.publicKey);

    [metadata, bump] = await PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        tokenMetadataProgram.toBytes(),
        mint.toBytes()
      ],
      tokenMetadataProgram
    );
    [masterEdition, bump] = await PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        tokenMetadataProgram.toBytes(),
        mint.toBytes(),
        Buffer.from('edition'),
      ],
      tokenMetadataProgram
    );
  })

  it('Creates nft!', async () => {


    console.log("mint address", mint.toString())
    console.log("to ", to.toString())
    console.log("metadata ", metadata.toString())
    console.log("masterEdition ", masterEdition.toString())
    console.log("baseAccount.publicKey ", baseAccount.publicKey.toString())
      const tx = await program.methods.mintNft(
         mint,
         testNftUri,
         testNftTitle,
         testNftSymbol
      )
        .accounts({
          mintAuthority: baseAccount.publicKey,
          mint:  mint,
          tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
          metadata: metadata,
          tokenMetadataProgram: tokenMetadataProgram,
          tokenAccount: to,
          payer: baseAccount.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          masterEdition: masterEdition,
        },
        ).signers([baseAccount])
        .rpc();
      console.log("Your transaction signature", tx);

  });

  it('Mints edition!', async () => {
    const newMint = await createMint(provider, baseAccount.publicKey);
    const newTo = await createTokenAccount(provider, newMint, baseAccount.publicKey);

    let edition:any = new anchor.BN(5);
    let editionNum = Math.floor(edition / EDITION_MARKER_BITSIZE);

    const [newMetadata, bump1] = await PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        tokenMetadataProgram.toBytes(),
        newMint.toBytes()
      ],
      tokenMetadataProgram
    );
    const [newEdition, bump2] = await PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        tokenMetadataProgram.toBytes(),
        newMint.toBytes(),
        Buffer.from('edition'),
      ],
      tokenMetadataProgram
    );

    const [mark, bump3] = await PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        tokenMetadataProgram.toBytes(),
        mint.toBytes(),
        Buffer.from('edition'),
        Buffer.from(editionNum.toString()),
      ],
      tokenMetadataProgram
    );

    const mint_tx = new anchor.web3.Transaction().add(
      // Fire a transaction to create our mint account that is controlled by our anchor wallet
      createMintToInstruction(
        newMint, newTo, baseAccount.publicKey, 1, [], TOKEN_PROGRAM_ID
      ),
    );
    // sends and create the transaction
    const res = await anchor.AnchorProvider.env().sendAndConfirm(mint_tx, [baseAccount]);


    console.log("mint address", newMint.toString())
    console.log("to ", newTo.toString())
    console.log("metadata ", newMetadata.toString())
    console.log("masterEdition ", newEdition.toString())
    console.log("baseAccount.publicKey ", baseAccount.publicKey.toString())

    // check result

    const tx = await program.methods.mintEditionFromMaster(edition).accounts({
      editionMark: mark,
      newMetadata,
      newEdition,
      newMint,
      newTokenAccount: newTo,
      newMintAuthority: baseAccount.publicKey,
      tokenMetadataProgram,
      metadata,
      metadataMint: mint,
      newMetadataUpdateAuthority: baseAccount.publicKey,
      masterEdition,
      payer: baseAccount.publicKey,
      tokenAccountOwner: baseAccount.publicKey,
      tokenAccount: to,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    }).signers([baseAccount]).rpc();

    console.log("Your transaction signature", tx);

       // const acc = new anchor.web3.PublicKey("CymenLYyH5YAJLJA5yfPnYRbguWvvQ2p1P7G6vWeL9bh");
       const program_id = new anchor.web3.PublicKey("8cosvg14TAARx4rdECCSJueosqMRY8mhRWu7m5oVGDj8")
       const idl = JSON.parse(
         require("fs").readFileSync("./target/idl/registry1.json", "utf8")
       );
       const program_new = new anchor.Program(idl, program_id,provider);
       //console.log("test acc",acc.toString());
       //let test= await program_new.account.newEdition.fetch(newEdition.toString());
       //let test2 = await program_new.account.masterEdition.fetch(masterEdition.toString())
  });

  

});

