export enum EPIType {
    CORDE = "CORDE",
    SANGLE = "SANGLE",
    LONGE = "LONGE",
    BAUDRIER = "BAUDRIER",
    CASQUE = "CASQUE",
    MOUSQUETON = "MOUSQUETON"
  }
  
  export enum ControleStatus {
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
    taille?: string;      // uniquement pour les textiles
    couleur?: string;     // uniquement pour les textiles
    dateAchat: Date;
    dateFabrication: Date;
    dateMiseEnService: Date;
    periodiciteControle: number; // en jours
    dateProchainControle: Date;
    isConforme: boolean;
    isExpired: boolean;
    isDeleted?: boolean; // pour le soft-delete
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
    password: string; // stocké sous forme hachée
    role: "gestionnaire" | "cordiste";
  }
  