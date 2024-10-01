# Projet GestionEPI

Dans le cadre du développement d'une application de suivi des Équipements de Protection Individuelle (EPI) pour une société de travaux en hauteur, une structure de données solide et cohérente doit être mise en place. Ce document présente les éléments de conception, incluant le modèle conceptuel et physique de la base de données, ainsi que les principales entités du système.

## Entités Principales

Le système repose sur trois entités principales : **Utilisateurs**, **Équipements**, et **Contrôles**.

### Utilisateurs
Chaque utilisateur est identifié par un numéro unique (**ID**) et possède des informations telles que :
- Nom
- Prénom
- Email
- Type d'utilisateur (gestionnaire ou cordiste)
- Mot de passe

En fonction de son type, l'utilisateur peut soit suivre les contrôles et les utilisations des EPI, soit simplement consulter l'état des équipements.

### Équipement (EPI)
Chaque EPI est identifiable via :
- **Identifiant unique personnalisé** attribué par le gestionnaire
- **Numéro de série**
- **Type d'équipement** (corde, baudrier, casque, mousqueton)
- **Taille** et **couleur** (pour les cordes, baudriers, etc.)

En plus de ces caractéristiques, chaque EPI inclut des informations sur :
- **Date d'achat**
- **Date de fabrication**
- **Date de mise en service**

Les EPI textiles doivent être remplacés obligatoirement tous les 10 ans, tandis que les équipements métalliques peuvent rester en service tant que leur état est jugé satisfaisant. Chaque EPI possède également une **périodicité de contrôle** spécifique, nécessaire pour générer des alertes de contrôles à venir.

### Contrôle
L'entité Contrôle permet de suivre les inspections régulières effectuées sur les EPI. Chaque contrôle est associé à un EPI et à un gestionnaire, et inclut les informations suivantes :
- **Date du contrôle**
- **Statut de l'EPI** après inspection (Opérationnel, À réparer, Mis au rebut)
- **Remarques** sur le contrôle

## Modélisation de la Base de Données

La modélisation de la base de données est conçue pour assurer la traçabilité des EPI, des contrôles effectués, et des utilisateurs impliqués. Les principales tables et leurs relations sont définies comme suit :

### Table **EPI**
| Colonne              | Type                              |
|----------------------|-----------------------------------|
| id_epi               | INT AUTO_INCREMENT                |
| num_serie            | VARCHAR(255)                      |
| type_epi             | INT (clé étrangère vers Type_EPI) |
| date_achat           | DATE                              |
| date_fabrication     | DATE                              |
| date_mise_service    | DATE                              |
| periode_controle     | INT                               |

### Table **Type_EPI**
| Colonne              | Type               |
|----------------------|--------------------|
| id_type              | INT AUTO_INCREMENT |
| nom_type             | VARCHAR(255)       |

### Table **Controle**
| Colonne              | Type                                              |
|----------------------|---------------------------------------------------|
| id_controle          | INT AUTO_INCREMENT                                |
| id_epi               | INT (clé étrangère vers EPI)                      |
| date_controle        | DATE                                              |
| statut_epi           | ENUM('Opérationnel', 'À réparer', 'Mis au rebut') |
| remarques            | TEXT                                              |

### Table **Gestionnaire**
| Colonne              | Type               |
|----------------------|--------------------|
| id_gestionnaire      | INT AUTO_INCREMENT |
| nom_gestionnaire     | VARCHAR(255)       |

L'ensemble de cette structure assure une gestion complète des équipements et des contrôles, en facilitant la traçabilité et les alertes pour les contrôles à venir.
![Modèle conceptuel de la base de données](https://github.com/Mehdi95T/GestionEPI/blob/main/img/Capture%20d'%C3%A9cran%202024-10-01%20103137.png)
