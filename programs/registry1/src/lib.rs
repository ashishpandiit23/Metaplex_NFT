use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_spl::token;
use anchor_spl::token::{MintTo, Token};
use mpl_token_metadata::instruction::{create_master_edition_v3, create_metadata_accounts_v2, mint_new_edition_from_master_edition_via_token};


declare_id!("8cosvg14TAARx4rdECCSJueosqMRY8mhRWu7m5oVGDj8");

#[program]
pub mod registry1 {
   // use alloc::collections;

    use std::collections::HashMap;

    use anchor_lang::solana_program::stake::instruction::AuthorizeCheckedWithSeedArgs;
    use metaplex_token_metadata::state::Creator;

    use super::*;

    pub fn mint_nft(
        ctx: Context<MintNFT>,
        creator_key: Pubkey,
        uri: String,
        title: String,
        symbol: String,
    ) -> Result<()> {
        msg!("Initializing Mint Ticket");
        let cpi_accounts = MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.payer.to_account_info(),
        };
        msg!("CPI Accounts Assigned");
        let cpi_program = ctx.accounts.token_program.to_account_info();
        msg!("CPI Program Assigned");
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        msg!("CPI Context Assigned");
        token::mint_to(cpi_ctx, 1)?;
        msg!("Token Minted !!!");
        let account_info = vec![
            ctx.accounts.metadata.to_account_info(),
            ctx.accounts.mint.to_account_info(),
            ctx.accounts.mint_authority.to_account_info(),
            ctx.accounts.payer.to_account_info(),
            ctx.accounts.token_metadata_program.to_account_info(),
            ctx.accounts.token_program.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
            ctx.accounts.rent.to_account_info(),
        ];
        msg!("Account Info Assigned");
        let creator = vec![
            mpl_token_metadata::state::Creator {
                address: creator_key,
                verified: false,
                share: 100,
            },
            mpl_token_metadata::state::Creator {
                address: ctx.accounts.mint_authority.key(),
                verified: false,
                share: 0,
            },
        ];
        msg!("Creator Assigned");
        let mut book_reviews = HashMap::new();
        book_reviews.insert("key :", ctx.accounts.mint.key());
        let mut vec = Vec::new();
        vec.push(1);
        let v = vec![1,2,3];
       
        invoke(
            &create_metadata_accounts_v2(
                ctx.accounts.token_metadata_program.key(),
                ctx.accounts.metadata.key(),
                ctx.accounts.mint.key(),
                ctx.accounts.mint_authority.key(),
                ctx.accounts.payer.key(),
                ctx.accounts.payer.key(),
                title,
                symbol,
                uri,
                Some(creator),
                1,
                true,
                false,
                None,
                None,
            ),
            account_info.as_slice(),
        )?;
        msg!("Metadata Account Created !!!");
        let master_edition_infos = vec![
            ctx.accounts.master_edition.to_account_info(),
            ctx.accounts.mint.to_account_info(),
            ctx.accounts.mint_authority.to_account_info(),
            ctx.accounts.payer.to_account_info(),
            ctx.accounts.metadata.to_account_info(),
            ctx.accounts.token_metadata_program.to_account_info(),
            ctx.accounts.token_program.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
            ctx.accounts.rent.to_account_info(),
        ];
        msg!("Master Edition Account Infos Assigned");
        invoke(
            &create_master_edition_v3(
                ctx.accounts.token_metadata_program.key(),
                ctx.accounts.master_edition.key(),
                ctx.accounts.mint.key(),
                ctx.accounts.payer.key(),
                ctx.accounts.mint_authority.key(),
                ctx.accounts.metadata.key(),
                ctx.accounts.payer.key(),
                None,
            ),
            master_edition_infos.as_slice(),
        )?;
        msg!("Master Edition Nft Minted !!!");

        Ok(())
    }

    pub fn mint_edition_from_master(
        ctx: Context<MintEditionFromMaster>,
        edition: u64,
      ) -> Result<()> {
        let accounts = & ctx.accounts;
      
        let mint_edition_instruction = mint_new_edition_from_master_edition_via_token(
          *accounts.token_metadata_program.key,
          *accounts.new_metadata.key,
          *accounts.new_edition.key,
          *accounts.master_edition.key,
          *accounts.new_mint.key,
          *accounts.new_mint_authority.key,
          *accounts.payer.key,
          *accounts.token_account_owner.key,
          *accounts.token_account.key,
          *accounts.new_metadata_update_authority.key,
          *accounts.metadata.key,
          *accounts.metadata_mint.key,
          edition,
        );
      
      
        let account_list: Vec<AccountInfo> = vec![
          accounts.new_metadata.to_account_info(),
          accounts.new_edition.to_account_info(),
          accounts.master_edition.to_account_info(),
          accounts.new_mint.to_account_info(),
          accounts.edition_mark.to_account_info(),
          accounts.new_mint_authority.to_account_info(),
          accounts.payer.to_account_info(),
          accounts.token_account_owner.to_account_info(),
          accounts.token_account.to_account_info(),
          accounts.new_metadata_update_authority.to_account_info(),
          accounts.metadata.to_account_info(),
          accounts.token_program.to_account_info(),
          accounts.system_program.to_account_info(),
          accounts.rent.to_account_info(),
        ];
      
        invoke(
          &mint_edition_instruction, 
          account_list.as_slice(),
        )?;
      
        Ok(())
      }
}


#[derive(Accounts)]
pub struct MintNFT<'info> {
    #[account(mut)]
    pub mint_authority: Signer<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub mint: UncheckedAccount<'info>,
    // #[account(mut)]
    pub token_program: Program<'info, Token>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub token_metadata_program: UncheckedAccount<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub token_account: UncheckedAccount<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub payer: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub rent: AccountInfo<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub master_edition: UncheckedAccount<'info>,
}


#[derive(Accounts)]
pub struct MintEditionFromMaster<'info> {
  /// CHECK: This is not dangerous because we don't read or write from this account
  #[account(mut)]
  pub edition_mark: UncheckedAccount<'info>,
  /// CHECK: This is not dangerous because we don't read or write from this account
  #[account(mut)]
  pub new_edition: UncheckedAccount<'info>,
  /// CHECK: This is not dangerous because we don't read or write from this account
  #[account(mut)]
  pub master_edition: UncheckedAccount<'info>,
  /// CHECK: This is not dangerous because we don't read or write from this account
  #[account(mut)]
  pub new_metadata: UncheckedAccount<'info>,
  /// CHECK: This is not dangerous because we don't read or write from this account
  #[account(mut)]
  pub new_metadata_update_authority: UncheckedAccount<'info>,
  /// CHECK: This is not dangerous because we don't read or write from this account
  #[account(mut)]
  pub metadata: UncheckedAccount<'info>,
  /// CHECK: This is not dangerous because we don't read or write from this account
  #[account(mut)]
  pub metadata_mint: UncheckedAccount<'info>,
  /// CHECK: This is not dangerous because we don't read or write from this account
  #[account(mut)]
  pub new_mint: UncheckedAccount<'info>,
  pub new_mint_authority: Signer<'info>,
  /// CHECK: This is not dangerous because we don't read or write from this account
  #[account(mut)]
  pub payer: Signer<'info>,
  /// CHECK: This is not dangerous because we don't read or write from this account
  pub token_account_owner: UncheckedAccount<'info>,
  /// CHECK: This is not dangerous because we don't read or write from this account
  pub token_account: UncheckedAccount<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub new_token_account: UncheckedAccount<'info>,
  /// CHECK: This is not dangerous because we don't read or write from this account
  pub token_metadata_program: UncheckedAccount<'info>,
  pub system_program: Program<'info, System>,
  pub token_program: Program<'info, Token>,
  pub rent: Sysvar<'info, Rent>
}