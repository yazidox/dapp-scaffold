import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionSignature } from '@solana/web3.js';
import { FC, useCallback } from 'react';
import { notify } from "../utils/notifications";
import * as splToken from "@solana/spl-token";
import { web3, Wallet } from "@project-serum/anchor";
import { Token, TOKEN_PROGRAM_ID,  } from '@solana/spl-token';



export const SendSpl: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction, signTransaction } = useWallet();

    const onClick = useCallback(async () => {
        if (!publicKey) {
            notify({ type: 'error', message: `Wallet not connected!` });
            console.log('error', `Send Transaction: Wallet not connected!`);
            return;
        }

        try {
           
            const toPublicKey = new PublicKey("6VD196VdkwuaPrPHns1LWKyVN8MrvUSAPNHKwYbnVDt7")
            const mint = new PublicKey('35iJ8xxd4agQAJLYLHLJVuw8YF893fD6QRxhvSig9ZX8')
            const pgid = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')

            const fromTokenAccount = await Token.getOrCreateAssociatedTokenAccount(
                connection,
                publicKey,
                mint,
                publicKey,
                signTransaction
            )

            const toTokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                mint,
                toPublicKey,
                signTransaction
            )

            const transaction = new Transaction().add(
                Token.createTransferInstruction(
                    fromTokenAccount.address, // source
                    toTokenAccount.address, // dest
                    publicKey,
                    2 * LAMPORTS_PER_SOL,
                    [],
                    pgid
                )
            )

            const blockHash = await connection.getRecentBlockhash()
            transaction.feePayer = await publicKey
            transaction.recentBlockhash = await blockHash.blockhash
            const signed = await signTransaction(transaction)
            await connection.sendRawTransaction(signed.serialize())


            notify({ type: 'success', message: 'Transaction successful!'});
        } catch (error: any) {
            notify({ type: 'error', message: `Transaction failed!`});
            console.log(error);
            
            return;
        }
    }, [publicKey, notify, connection, sendTransaction]);

   
    return (
        <div>
           
            <button
                className="group w-60 m-2 btn animate-pulse disabled:animate-none bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ... "
                onClick={onClick} disabled={!publicKey}
            >
                <div className="hidden group-disabled:block ">
                    Wallet not connected
                </div>
                <span className="block group-disabled:hidden" > 
                    Send SPL Transaction 
                </span>
            </button>
        </div>
    );
};
