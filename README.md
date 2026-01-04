# Mate 🏸

Mate est une application web permettant de **proposer une intention de match** (padel) en quelques secondes : date, créneau, zone, niveau.

L’objectif est de **simplifier l’organisation d’un match**, avant même la réservation d’un terrain.

## Démo
👉 [https://mate-padel-zjp2-avbmjobdq-charlesbzts-projects.vercel.app/](https://mate-padel.vercel.app/)

## Pourquoi Mate ?
Organiser un match est souvent plus compliqué que jouer :
- trouver des joueurs disponibles
- s’accorder sur un créneau
- décider du lieu et du niveau

Mate répond à ce problème par une approche simple :
> *Je propose une intention → les autres voient.*

## Fonctionnalités (V1)
- Authentification utilisateur (Supabase)
- Création d’une intention de match
- Consultation des intentions publiées
- Interface claire, responsive et “app-like”

## Roadmap (V2)
- Matching réel (rejoindre / quitter une intention)
- Limite à 4 joueurs
- Filtres par zone / date / niveau
- Partage d’une intention via lien

## Stack technique
- Frontend : **React + TypeScript + Vite**
- Backend : **Supabase (Auth + PostgreSQL + RLS)**
- Déploiement : **Vercel**

## Architecture
- `match_intentions` : table principale (créateur + infos match)
- Auth et sécurité gérées par Supabase

## Installation locale

```bash
npm install
npm run dev
