export declare enum EPIType {
    CORDE = "CORDE",
    SANGLE = "SANGLE",
    LONGE = "LONGE",
    BAUDRIER = "BAUDRIER",
    CASQUE = "CASQUE",
    MOUSQUETON = "MOUSQUETON"
}
export declare enum ControleStatus {
    OPERATIONNEL = "OPERATIONNEL",
    A_REPARER = "A_REPARER",
    MIS_AU_REBUT = "MIS_AU_REBUT"
}
export interface IEPI {
    id: number;
    identifiant: string;
    marque: string;
    modele: string;
    numeroSerie: string;
    type: EPIType;
    taille?: string;
    couleur?: string;
    dateAchat: Date;
    dateFabrication: Date;
    dateMiseEnService: Date;
    periodiciteControle: number;
    dateProchainControle: Date;
    isConforme: boolean;
    isExpired: boolean;
    isDeleted?: boolean;
}
export interface IControle {
    id: number;
    dateControle: Date;
    epiId: number;
    statut: ControleStatus;
    remarques: string;
}
export interface IUser {
    id: number;
    username: string;
    password: string;
    role: "gestionnaire" | "cordiste";
}
