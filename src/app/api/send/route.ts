import { NextRequest, NextResponse } from 'next/server';

const TOKEN = '7843396833:AAEvYzgcxJ35LfEkAHju74BM8YHZ7ag_knA';
const CHAT_ID = '';
const BASE_URL = `https://api.telegram.org/bot${ TOKEN }`;

export const POST = async ( req: NextRequest ) =>
{
    try
    {
        const { message, message_id } = await req.json();

        if ( !message )
        {
            return NextResponse.json( { success: false, msg: 'thiếu message' }, { status: 400 } );
        }

        if ( message_id )
        {
            await fetch( `${ BASE_URL }/unpinChatMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( {
                    chat_id: CHAT_ID,
                    message_id: message_id
                } )
            } );

            const editRes = await fetch( `${ BASE_URL }/editMessageText`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( {
                    chat_id: CHAT_ID,
                    message_id,
                    text: message,
                    parse_mode: 'HTML'
                } )
            } );

            const editData = await editRes.json();
            if ( !editRes.ok )
            {
                console.log( 'lỗi edit:', editData.description );
                return NextResponse.json( { success: false, err: editData.description }, { status: 400 } );
            }

            await fetch( `${ BASE_URL }/pinChatMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( {
                    chat_id: CHAT_ID,
                    message_id: message_id,
                    disable_notification: false
                } )
            } );

            return NextResponse.json( { success: true, message_id } );
        }

        const response = await fetch( `${ BASE_URL }/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( {
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            } )
        } );

        const data = await response.json();
        return NextResponse.json( {
            success: response.ok,
            message_id: data?.result?.message_id ?? null
        } );

    } catch ( err )
    {
        console.error( 'lỗi server:', err );
        return NextResponse.json( { success: false }, { status: 500 } );
    }
};