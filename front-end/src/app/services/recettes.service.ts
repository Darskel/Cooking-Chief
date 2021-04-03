import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Recette } from '../models/Recette.models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecettesService {

	constructor(private http: HttpClient){ }

	// tempUrl = 'assets/test_api/pizza.json';
	tempUrl = "http://localhost:5500/";

	valRecherche: string = "";
	valRecherchePrec: string;

	tabRecettes: Recette[] = [];
	private recettesSubject = new Subject<Recette[]>();

	emitRecetteSubject() {
		//   je fais un ... afin de destructurer le tableau
		// renvoyés une copie et non l'original ;)
		return this.recettesSubject.next([...this.tabRecettes]);
	}

	// Vérifie si le tableau de recettes est rempli
	tabNonVide() { return (this.tabRecettes.length > 0); }

	// Renvoi un observable sur le subject à observer
	// dans le cas présent : la liste des recettes
	getRecettesUpdateListener() : Observable<Recette[]> { return this.recettesSubject.asObservable(); }

	getTabRecettes(): Recette[]{ return this.tabRecettes; }

	requetteBdd(recette_id :string) {
		// RECUPERATION DES RECETTES RENVOYEES PAR LA BDD
		return this.http
			.get<{message:string, recette: any}>(`http://localhost:5500/recettes/${recette_id}`)
			.subscribe(
			(response) => {
				console.log(response);
				const recettes =  response[0];
				let id = 1;
				console.log(recettes);
				recettes['hits'].forEach( (value) => {
					let rec: Recette = {
					id: id,
					titre: value.recipe.label,
					image: value.recipe.image,
					nbPortions: value.recipe.yield,
					listeIngredients: value.recipe.ingredientLines,
					calories: value.recipe.calories,
					tempsPreparation: value.recipe.totalTime,
					auteur: value.recipe.source,
					url: value.recipe.url
					}
					id+= 1;
					this.tabRecettes.push(rec);

				})
				this.recettesSubject.next([...this.tabRecettes]);

			}, (error) => {
				console.log("Erreur : " + error);
			});
	}

	getRecettes(){
	// RECUPERATION DES RECETTES RENVOYEES PAR LA BDD
	return this.http.get<any>(this.tempUrl).subscribe(
		(response) =>  {
			const recettes =  response[0];
			let id = 1;
			console.log(recettes);
			recettes['hits'].forEach( (value) => {
				let rec: Recette = {
				id: id,
				titre: value.recipe.label,
				image: value.recipe.image,
				nbPortions: value.recipe.yield,
				listeIngredients: value.recipe.ingredientLines,
				calories: value.recipe.calories,
				tempsPreparation: value.recipe.totalTime,
				auteur: value.recipe.source,
				url: value.recipe.url
				}
				id+= 1;
				this.tabRecettes.push(rec);

			})
			this.recettesSubject.next([...this.tabRecettes]);
		});
	}

	// Renvoi une recette si elle est trouve
	getRecetteById(id: number){
		const recipe = this.tabRecettes.find(
			(r) => { return r.id === id;
		});
		return recipe;
	}

	setValRecherche(valeur: string){ this.valRecherche = valeur; }

	getValRecherche(){ return this.valRecherche; }
}
