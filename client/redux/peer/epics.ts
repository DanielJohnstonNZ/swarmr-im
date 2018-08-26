import { Observable, Observer } from "rxjs";
import { Epic, combineEpics } from "redux-observable";

import { PeerState } from ".";
import { IActions } from "..";

import { ISocketMessageAction, socketSend } from "../websocket";
import { MetaDataType, MetaData } from "../../../common/metadata";

import { PeerFactory } from "../../helpers/peerFactory";
import { metaSent, IPeerSendMessageAction } from "./actions";

const peerManager = new PeerFactory();

const onSocketMessage: Epic<IActions, PeerState> = action$ =>
  action$
    .ofType("websocket/SOCKET_MESSAGE")
    .do((action: ISocketMessageAction) =>
      peerManager.metaDataInput(action.message)
    )
    .map((action: ISocketMessageAction) => metaSent());

const onSendMessage: Epic<IActions, PeerState> = action$ =>
  action$
    .ofType("peer/SEND_MESSAGE")
    .do((action: IPeerSendMessageAction) =>
      peerManager.messageAll(action.message)
    )
    .map((action: ISocketMessageAction) => metaSent());

export const peerEpics = combineEpics(onSocketMessage, onSendMessage);
