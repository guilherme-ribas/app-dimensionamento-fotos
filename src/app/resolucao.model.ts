export class Resolucao{
    width: number;
    height: number;
    widthRatio: number;
    heightRatio: number;
}

export class RedeSocial{
id: string;
nome: string;
postagem: string;
resolucao: Resolucao = new Resolucao();
}
