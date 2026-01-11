#![cfg(feature = "test-sbf")]

use borsh::BorshDeserialize;
use trezoa_program_test::{tokio, ProgramTest};
use trezoa_sdk::{
    signature::{Keypair, Signer},
    transaction::Transaction,
};

#[tokio::test]
async fn create() {
    let mut context = ProgramTest::new("tpl_inscription", tpl_inscription::ID, None)
        .start_with_context()
        .await;

    // Given a new keypair.

    let address = Keypair::new();
}
