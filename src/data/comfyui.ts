import type { Language } from '../types/language';
import type { ComfyUIWorkflow, WorkflowId } from '../types/comfyui';
import type { FlowEdge, FlowNode, WireType } from '../types/flow';
import { validateFlow } from '../utils/flow';

/*
 * Workflows ComfyUI : la partie commune (topologie, positions, labels techniques non traduits)
 * est écrite une fois, les textes (résumés, explications, valeurs lisibles) sont doublés FR / EN.
 * Graphes simplifiés mais fidèles aux JSON réels de COMFYUI/workflows/.
 * Grille : col 0..4 (gauche → droite). Quand une chaîne dépasse 5 colonnes, elle « revient à la ligne »
 * plus bas (bande suivante) ou le dernier nœud est empilé sous son producteur.
 */

type NodeBase = Pick<FlowNode, 'id' | 'label' | 'kind' | 'col' | 'row'>;
type NodeText = Pick<FlowNode, 'summary' | 'detail' | 'params'>;

interface WorkflowBase {
  id: WorkflowId;
  icon: string;
  techStack: string[];
  nodes: NodeBase[];
  edges: FlowEdge[];
}

type WorkflowText = Pick<ComfyUIWorkflow, 'title' | 'tagline' | 'io' | 'features'> & {
  nodes: Record<string, NodeText>;
};

const n = (id: string, label: string, kind: FlowNode['kind'], col: number, row: number): NodeBase => ({
  id,
  label,
  kind,
  col,
  row,
});
const e = (from: string, to: string, type?: WireType): FlowEdge => (type ? { from, to, type } : { from, to });

const base: WorkflowBase[] = [
  {
    // image_flux2_klein_image_edit_9b_base.json
    id: 't2i',
    icon: 'image',
    techStack: ['FLUX.2 Klein 9B', 'Qwen 3 8B', 'ComfyUI'],
    nodes: [
      n('unet', 'UNETLoader', 'loader', 0, 0),
      n('clip', 'CLIPLoader', 'loader', 0, 2),
      n('pos', 'CLIP Text Encode (Positive)', 'text', 1, 1),
      n('neg', 'CLIP Text Encode (Negative)', 'text', 1, 2),
      n('noise', 'RandomNoise', 'latent', 2, 0),
      n('guider', 'CFGGuider', 'sampler', 2, 1),
      n('select', 'KSamplerSelect', 'sampler', 2, 2),
      n('scheduler', 'Flux2Scheduler', 'sampler', 2, 3),
      n('latent', 'EmptyFlux2LatentImage', 'latent', 2, 4),
      n('sampler', 'SamplerCustomAdvanced', 'sampler', 3, 2),
      n('vae', 'VAELoader', 'loader', 3, 3),
      n('decode', 'VAE Decode', 'decode', 4, 2),
      n('save', 'Save Image', 'output', 4, 3),
    ],
    edges: [
      e('unet', 'guider', 'MODEL'),
      e('clip', 'pos', 'CLIP'),
      e('clip', 'neg', 'CLIP'),
      e('pos', 'guider', 'CONDITIONING'),
      e('neg', 'guider', 'CONDITIONING'),
      e('noise', 'sampler'),
      e('guider', 'sampler'),
      e('select', 'sampler'),
      e('scheduler', 'sampler'),
      e('latent', 'sampler', 'LATENT'),
      e('sampler', 'decode', 'LATENT'),
      e('vae', 'decode', 'VAE'),
      e('decode', 'save', 'IMAGE'),
    ],
  },
  {
    // VideoAnime.json (branche Image → Vidéo active)
    id: 'i2v',
    icon: 'video',
    techStack: ['Wan 2.2 14B', 'Lightning LoRA', 'RIFE', 'MMAudio', 'ComfyUI'],
    nodes: [
      n('load', 'LoadImage', 'input', 0, 0),
      n('clip', 'CLIPLoader', 'loader', 0, 1),
      n('vae', 'VAELoader', 'loader', 0, 3),
      n('unetHigh', 'UNETLoader HIGH', 'loader', 0, 4),
      n('unetLow', 'UNETLoader LOW', 'loader', 0, 5),
      n('resize', 'ImageResize', 'post', 1, 0),
      n('pos', 'CLIP Text Encode +', 'text', 1, 1),
      n('neg', 'CLIP Text Encode −', 'text', 1, 2),
      n('loraHigh', 'LoRA Lightning HIGH', 'loader', 1, 4),
      n('loraLow', 'LoRA Lightning LOW', 'loader', 1, 5),
      n('wan', 'WanImageToVideo', 'latent', 2, 1),
      n('msHigh', 'ModelSamplingSD3 HIGH', 'sampler', 2, 4),
      n('msLow', 'ModelSamplingSD3 LOW', 'sampler', 2, 5),
      n('ksHigh', 'KSamplerAdvanced HIGH', 'sampler', 3, 3),
      n('ksLow', 'KSamplerAdvanced LOW', 'sampler', 4, 4),
      // Bande 2 : post-traitement (retour à la ligne après KSamplerAdvanced LOW)
      n('decode', 'VAE Decode', 'decode', 1, 7),
      n('rife', 'RIFE', 'post', 2, 7),
      n('mmaudio', 'MMAudio', 'post', 3, 8),
      n('combine', 'Video Combine', 'output', 4, 7),
    ],
    edges: [
      e('load', 'resize', 'IMAGE'),
      e('resize', 'wan', 'IMAGE'),
      e('clip', 'pos', 'CLIP'),
      e('clip', 'neg', 'CLIP'),
      e('pos', 'wan', 'CONDITIONING'),
      e('neg', 'wan', 'CONDITIONING'),
      e('vae', 'wan', 'VAE'),
      e('unetHigh', 'loraHigh', 'MODEL'),
      e('loraHigh', 'msHigh', 'MODEL'),
      e('unetLow', 'loraLow', 'MODEL'),
      e('loraLow', 'msLow', 'MODEL'),
      e('msHigh', 'ksHigh', 'MODEL'),
      e('msLow', 'ksLow', 'MODEL'),
      // WanImageToVideo envoie conditionnements + latent aux deux samplers ; un câble par paire de nœuds.
      e('wan', 'ksHigh', 'LATENT'),
      e('wan', 'ksLow', 'CONDITIONING'),
      e('ksHigh', 'ksLow', 'LATENT'),
      e('ksLow', 'decode', 'LATENT'),
      e('vae', 'decode', 'VAE'),
      e('decode', 'rife', 'IMAGE'),
      e('rife', 'mmaudio', 'IMAGE'),
      e('rife', 'combine', 'IMAGE'),
      e('mmaudio', 'combine'), // audio : pas de WireType
    ],
  },
  {
    // trellis2_single_image_v001.json
    id: 'i3d',
    icon: 'box',
    techStack: ['TRELLIS.2-4B', 'DINOv3', 'ComfyUI'],
    nodes: [
      n('load', 'LoadImageWithTransparency', 'input', 0, 0),
      n('model', 'LoadModel', 'loader', 0, 1),
      n('pre', 'PreProcessImage', 'post', 1, 0),
      n('cond', 'ImageCondGenerator', 'latent', 2, 1),
      n('sparse', 'SparseGenerator', 'sampler', 3, 0),
      n('shape', 'ShapeGenerator', 'sampler', 4, 1),
      // Bande 2 : du latent au fichier (retour à la ligne après ShapeGenerator)
      n('decode', 'DecodeLatents', 'decode', 0, 3),
      n('fill', 'FillHoles', 'post', 1, 3),
      n('recon', 'ReconstructMesh', 'post', 2, 3),
      n('simplify', 'SimplifyMesh', 'post', 3, 3),
      n('export', 'ExportMesh', 'output', 4, 3),
      n('preview', 'Preview3D', 'output', 4, 4),
    ],
    edges: [
      e('load', 'pre', 'IMAGE'),
      e('pre', 'cond', 'IMAGE'),
      e('model', 'cond', 'MODEL'),
      e('cond', 'sparse', 'CONDITIONING'),
      e('cond', 'shape', 'CONDITIONING'),
      e('sparse', 'shape', 'LATENT'),
      e('shape', 'decode', 'LATENT'),
      e('decode', 'fill', 'MESH'),
      e('fill', 'recon', 'MESH'),
      e('recon', 'simplify', 'MESH'),
      e('simplify', 'export', 'MESH'),
      e('export', 'preview', 'MESH'),
    ],
  },
];

const textFR: Record<WorkflowId, WorkflowText> = {
  t2i: {
    title: 'FLUX.2 Klein 9B — Texte → Image',
    tagline:
      "Décrire une scène avec des mots et obtenir une image réaliste, construite en retirant du bruit étape par étape.",
    io: 'Texte → Image 1280×1280',
    features: [
      'Personnages et objets réalistes',
      'Références pour reconstruction 3D',
      "Poses d'action dynamiques",
      "Variante : édition d'image guidée par texte",
    ],
    nodes: {
      unet: {
        summary: 'Charge FLUX.2 Klein 9B, le modèle de diffusion qui « dessine » en retirant du bruit.',
        detail:
          "Le modèle de diffusion (9 milliards de paramètres) a appris à retirer du bruit d'une image, un peu à chaque étape, en suivant le texte. Il ne manipule jamais de pixels : il travaille dans l'espace latent, une version compressée de l'image, bien plus rapide à calculer. C'est la version « base » (non distillée) : elle utilise un vrai guidage CFG, donc le prompt négatif compte. Le format fp8 stocke les poids sur 8 bits, ce qui divise la mémoire vidéo nécessaire par deux pour une perte de qualité minime.",
        params: [
          {
            name: 'unet_name',
            value: 'flux-2-klein-base-9b-fp8',
            explain:
              'Le fichier du modèle. Un modèle plus gros suit mieux les prompts complexes mais demande plus de mémoire vidéo et de temps.',
          },
        ],
      },
      clip: {
        summary: "Charge l'encodeur de texte Qwen 3 8B, qui traduit le prompt dans la langue du modèle.",
        detail:
          "Le modèle de diffusion ne lit pas les mots : il lui faut des vecteurs de nombres. Cet encodeur, un modèle de langage Qwen 3 de 8 milliards de paramètres, transforme le prompt en une suite de vecteurs (embeddings) qui portent le sens de la phrase. Le nom « CLIP » est historique : ComfyUI l'emploie pour tout encodeur de texte. Un encodeur puissant comprend mieux les descriptions longues, les positions relatives et le texte à écrire dans l'image.",
        params: [
          {
            name: 'clip_name',
            value: 'qwen_3_8b_fp8mixed',
            explain:
              "Les poids de l'encodeur, en précision mixte : 8 bits pour la plupart des couches, plus de précision là où c'est sensible.",
          },
          {
            name: 'type',
            value: 'flux2',
            explain:
              "Indique comment formater les embeddings pour FLUX.2. Avec un mauvais type, l'image n'a plus de rapport avec le prompt.",
          },
        ],
      },
      pos: {
        summary: "Encode le prompt positif : ce que l'image doit montrer.",
        detail:
          "Le texte (sujet, pose, éclairage, cadrage…) passe dans l'encodeur et devient un « conditionnement ». À chaque étape, le guider compare ce que le modèle prédit avec ce conditionnement et avec le négatif, puis pousse l'image vers la version qui correspond au positif : le prompt positif attire. Plus il est précis et structuré, moins le modèle improvise.",
        params: [
          {
            name: 'text',
            value: '« A full-body 3D reference image of… »',
            explain:
              "Le prompt réel du workflow (une référence de personnage pour la 3D). Ajouter des détails réduit la part de hasard ; un prompt vague laisse le modèle choisir.",
          },
        ],
      },
      neg: {
        summary: "Encode le prompt négatif : ce que l'image doit éviter.",
        detail:
          "Il est encodé exactement comme le positif, mais le guider s'en sert comme d'un repoussoir : à chaque étape, l'image est éloignée de ce qu'il décrit (flou, doigts en trop, texte parasite…). Ici il est vide : le point de départ est alors la prédiction « sans description », et le guidage renforce simplement tout ce qui vient du prompt positif. Le négatif n'a d'effet que si le CFG est supérieur à 1.",
        params: [
          {
            name: 'text',
            value: '(vide)',
            explain:
              "Vide = rien de précis à repousser. Y écrire des défauts (« blurry, extra fingers ») les fait reculer, mais une longue liste peut aussi appauvrir l'image.",
          },
        ],
      },
      noise: {
        summary: 'Produit le bruit de départ, entièrement défini par la seed.',
        detail:
          "Toute génération part d'un bruit aléatoire que le modèle va sculpter. Ce bruit est déterminé par un simple nombre, la seed : même seed et mêmes réglages donnent la même image. Avec « randomize », une nouvelle seed est tirée à chaque lancement, donc une nouvelle composition.",
        params: [
          {
            name: 'noise_seed',
            value: '572357623973097',
            explain:
              "Changer la seed change la composition (pose, cadrage, couleurs) sans toucher au prompt. Noter celle d'une image réussie permet de la reproduire.",
          },
          {
            name: 'control_after_generate',
            value: 'randomize',
            explain:
              "« randomize » tire une seed différente à chaque lancement ; « fixed » la garde, pour modifier le prompt en gardant la même base d'image.",
          },
        ],
      },
      guider: {
        summary: 'Combine le modèle et les prompts positif / négatif avec une force de guidage (CFG 5).',
        detail:
          "À chaque étape, le modèle fait deux prédictions : une avec le prompt positif, une avec le négatif. Le guider amplifie l'écart entre les deux : résultat = négatif + CFG × (positif − négatif). À 1, seul le positif compte et le négatif n'est même pas calculé ; au-dessus, l'image colle davantage au texte.",
        params: [
          {
            name: 'cfg',
            value: '5',
            explain:
              "Force d'adhérence au prompt. Plus haut : plus fidèle au texte, mais couleurs saturées, contrastes durs, voire artefacts. Plus bas : rendu plus naturel, mais la description est moins respectée.",
          },
        ],
      },
      select: {
        summary: "Choisit l'algorithme de débruitage : euler.",
        detail:
          "Le sampler est la méthode de calcul qui fait passer l'image d'un niveau de bruit au suivant. Euler est le plus simple : une prédiction par étape, rapide et stable. D'autres (heun, dpmpp_2m…) font des pas plus élaborés, parfois plus précis en peu d'étapes, parfois plus lents.",
        params: [
          {
            name: 'sampler_name',
            value: 'euler',
            explain:
              "Changer de sampler modifie légèrement le rendu et la vitesse. Les variantes « ancestral » (euler_a) réinjectent du bruit à chaque étape : plus de variété, mais l'image ne se fige jamais vraiment.",
          },
        ],
      },
      scheduler: {
        summary: 'Prévoit le calendrier du débruitage, réparti sur 30 étapes.',
        detail:
          "Le scheduler calcule la liste des niveaux de bruit (les « sigmas ») à traverser, du bruit pur jusqu'à l'image nette. Celui de FLUX.2 adapte cette courbe à la résolution : une grande image reste plus longtemps dans le bruit fort, le temps de bien poser la composition. Le sampler suit ensuite ce calendrier pas à pas.",
        params: [
          {
            name: 'steps',
            value: '30',
            explain:
              "Nombre d'étapes de débruitage. Plus d'étapes = détails plus fins jusqu'à un plateau, mais temps proportionnel ; trop peu = image floue ou inachevée.",
          },
        ],
      },
      latent: {
        summary: 'Crée la toile de départ : un latent vide de 1280×1280.',
        detail:
          "Le latent est l'image en version compressée : une petite grille de nombres, bien plus petite que l'image finale, où le modèle travaille beaucoup plus vite qu'en pixels. Ce nœud en fixe la taille et le nombre d'images ; le bruit y est ajouté ensuite par RandomNoise.",
        params: [
          {
            name: 'width × height',
            value: '1280 × 1280',
            explain:
              "Résolution de sortie. Plus grand = plus de détails, mais calcul plus long et plus de mémoire ; trop loin des tailles d'entraînement, le modèle peut dupliquer des éléments.",
          },
          {
            name: 'batch_size',
            value: '1',
            explain:
              "Nombre d'images générées en même temps. Augmenter permet de comparer plusieurs variantes d'un coup, au prix de la mémoire.",
          },
        ],
      },
      sampler: {
        summary: "Exécute le débruitage : du bruit jusqu'à l'image latente finale.",
        detail:
          "C'est le moteur qui assemble les quatre pièces : le bruit (RandomNoise), la méthode (KSamplerSelect), le calendrier (Flux2Scheduler) et le guidage (CFGGuider), puis débruite le latent étape par étape. Le KSampler classique fait tout cela en un seul nœud « tout-en-un » (seed, steps, cfg, sampler, scheduler) ; FLUX le découpe en nœuds séparés pour pouvoir remplacer chaque pièce indépendamment. Le résultat est un latent propre, encore illisible tant qu'il n'est pas décodé.",
      },
      vae: {
        summary: "Charge le VAE, le traducteur entre pixels et espace latent.",
        detail:
          "Le VAE (autoencodeur variationnel) compresse une image en latent (encodeur) et reconstruit les pixels à partir du latent (décodeur). Ici, seul le décodeur sert, à la toute fin. Variante édition du même workflow : LoadImage → VAEEncode → ReferenceLatent encode une image existante et l'accroche au conditionnement, pour la modifier au lieu de partir de zéro.",
        params: [
          {
            name: 'vae_name',
            value: 'full_encoder_small_decoder',
            explain:
              'Encodeur complet associé à un décodeur allégé : décodage plus rapide et moins gourmand, au prix de détails très fins un peu moins nets.',
          },
        ],
      },
      decode: {
        summary: "Reconvertit le latent en vraie image, en pixels.",
        detail:
          "Le décodeur du VAE agrandit la grille latente compressée en image couleur pleine résolution et recrée textures et détails fins. C'est la seule étape qui produit des pixels visibles ; un VAE qui ne correspond pas au modèle donne des couleurs fausses ou une image brouillée.",
      },
      save: {
        summary: "Enregistre l'image finale sur le disque.",
        detail:
          "Écrit l'image en PNG dans le dossier de sortie, avec tout le workflow caché dans ses métadonnées : glisser le PNG dans ComfyUI recharge le graphe et ses réglages. Preview Image fait la même chose sans enregistrer.",
        params: [
          {
            name: 'filename_prefix',
            value: 'flux2_klein_edit',
            explain: "Début du nom de fichier ; ComfyUI ajoute un compteur pour ne jamais écraser d'image.",
          },
        ],
      },
    },
  },
  i2v: {
    title: 'Wan 2.2 14B — Image → Vidéo',
    tagline:
      'Animer une image fixe en vidéo de 5 secondes guidée par un prompt, avec deux modèles experts qui se passent le relais.',
    io: 'Image + texte → Vidéo 5 s · 832×480 · 32 fps',
    features: [
      'Image → Vidéo',
      'Deux experts (structure puis détails) en 6 étapes',
      'Interpolation RIFE 16 → 32 fps',
      'Audio automatique optionnel (MMAudio)',
    ],
    nodes: {
      load: {
        summary: 'Charge l’image de départ, qui devient la première frame de la vidéo.',
        detail:
          "L'image fournie est imposée comme première frame : le modèle doit la conserver et inventer le mouvement qui suit. Sa netteté et son cadrage se retrouvent dans toute la vidéo.",
      },
      resize: {
        summary: 'Met l’image au format de la vidéo (832×480).',
        detail:
          "L'image est redimensionnée et ses dimensions sont transmises à WanImageToVideo, pour que la vidéo ait exactement le même cadre. La taille pèse lourd : chaque pixel ajouté est calculé sur 81 frames.",
        params: [
          {
            name: 'width × height',
            value: '832 × 480',
            explain:
              'Résolution de la vidéo. Plus grand = plus de détails, mais temps et mémoire explosent ; plus petit = rapide mais flou.',
          },
          {
            name: 'upscale_method',
            value: 'lanczos',
            explain: 'Méthode de redimensionnement ; lanczos garde bien la netteté des contours.',
          },
          {
            name: 'divisible_by',
            value: '16',
            explain:
              "Arrondit les dimensions à un multiple de 16, ce qu'exige la compression latente du modèle vidéo.",
          },
        ],
      },
      clip: {
        summary: "Charge l'encodeur de texte UMT5-XXL utilisé par Wan.",
        detail:
          "UMT5-XXL est un encodeur de texte multilingue : il transforme le prompt en vecteurs que le modèle vidéo comprend. Il tourne ici sur le processeur (CPU) pour laisser toute la mémoire de la carte graphique au modèle de 14 milliards de paramètres.",
        params: [
          {
            name: 'clip_name',
            value: 'umt5_xxl_fp8_e4m3fn_scaled',
            explain: "Poids de l'encodeur en 8 bits : deux fois moins de mémoire qu'en 16 bits, pour une différence minime.",
          },
          {
            name: 'device',
            value: 'cpu',
            explain:
              "Encoder sur CPU est plus lent mais libère de la mémoire vidéo ; ce calcul n'a lieu qu'une fois par prompt, le coût reste faible.",
          },
        ],
      },
      pos: {
        summary: 'Décrit le mouvement voulu : action, caméra, ambiance.',
        detail:
          "En image → vidéo, l'image fixe déjà l'apparence : le prompt sert surtout à décrire ce qui bouge (geste, mouvement de caméra, vent, lumière). Il devient un conditionnement que WanImageToVideo associe à l'image de départ. Avec un CFG proche de 1, c'est lui qui guide presque seul la génération.",
      },
      neg: {
        summary: "Liste ce que la vidéo doit éviter — effet limité dans ce workflow.",
        detail:
          "Un prompt négatif n'agit que si le CFG dépasse 1 : le sampler compare alors les prédictions avec le positif et avec le négatif, et s'éloigne du second. Ici, le premier passage est à CFG 1,2 (effet léger) et le second à 1, valeur à laquelle le négatif est ignoré. C'est pourquoi le second passage utilise une variante NAG (Normalized Attention Guidance), qui redonne un effet au négatif même à CFG 1.",
      },
      vae: {
        summary: 'Charge le VAE de Wan 2.1, qui compresse et reconstruit les frames.',
        detail:
          "Le VAE vidéo compresse l'espace (8× par côté) et le temps (4 frames → 1) : les 81 frames deviennent 21 « tranches » latentes, ce qui rend la génération possible sur une seule carte graphique. Il sert deux fois : pour encoder l'image de départ dans WanImageToVideo, et pour décoder la vidéo finale. Wan 2.2 14B réutilise le VAE de Wan 2.1.",
        params: [
          {
            name: 'vae_name',
            value: 'wan_2.1_vae',
            explain: 'Doit correspondre au modèle : un autre VAE donnerait des couleurs fausses ou une image bruitée.',
          },
        ],
      },
      unetHigh: {
        summary: "Charge l'expert « bruit fort » de Wan 2.2, qui pose la scène et le mouvement.",
        detail:
          "Wan 2.2 14B utilise deux experts (Mixture of Experts) : celui-ci traite les premières étapes, très bruitées, où se décident la composition et le mouvement global. Il passe ensuite par sa propre LoRA Lightning avant d'arriver au sampler. Les poids en fp8 tiennent sur une carte graphique grand public.",
        params: [
          {
            name: 'unet_name',
            value: 'Wan2.2_Remix_i2v_14b_high_lighting_fp8',
            explain: "Modèle image → vidéo pour le bruit fort ; le remplacer change le style et la dynamique du mouvement.",
          },
        ],
      },
      unetLow: {
        summary: "Charge l'expert « bruit faible », qui affine les détails.",
        detail:
          "Le second expert prend le relais quand la vidéo est presque formée : il soigne textures, visages et stabilité d'une frame à l'autre. Avoir deux spécialistes donne la qualité d'un modèle bien plus gros, alors qu'un seul modèle de 14B tourne à chaque étape.",
        params: [
          {
            name: 'unet_name',
            value: 'Wan2.2_Remix_i2v_14b_low_lighting_fp8',
            explain: "Modèle image → vidéo pour le bruit faible ; c'est lui qui décide de la finesse finale.",
          },
        ],
      },
      loraHigh: {
        summary: "Ajoute la LoRA Lightning 4 steps à l'expert « bruit fort » pour générer en très peu d'étapes.",
        detail:
          "Une LoRA est un petit fichier de poids additionnels qui modifie le comportement d'un modèle sans le réentraîner. Lightning est une distillation : elle apprend au modèle à faire en quelques étapes, avec un CFG proche de 1, ce qui en demandait des dizaines. Chaque expert a sa propre LoRA Lightning, entraînée pour sa plage de bruit : celle-ci pour le bruit fort.",
        params: [
          {
            name: 'lora',
            value: 'Wan22_A14B_T2V_HIGH_Lightning_4steps (rank 128)',
            explain: 'Le fichier de la LoRA ; le rang (128) mesure sa capacité à modifier le modèle : plus haut = plus expressif, mais plus lourd.',
          },
          {
            name: 'strength',
            value: '1',
            explain:
              "Intensité de la LoRA. Plus bas = accélération moins efficace (il faut plus d'étapes) ; au-dessus de 1, risque d'artefacts.",
          },
        ],
      },
      loraLow: {
        summary: "Ajoute la LoRA Lightning 4 steps à l'expert « bruit faible » pour finir en très peu d'étapes.",
        detail:
          "Même principe que sur la branche « bruit fort », avec la LoRA entraînée pour les dernières étapes, peu bruitées. Grâce aux deux LoRA, toute la vidéo tient en 6 étapes : quelques minutes au lieu de plusieurs dizaines, au prix d'un peu de variété.",
        params: [
          {
            name: 'lora',
            value: 'Wan22_A14B_T2V_LOW_Lightning_4steps (rank 64)',
            explain: 'Le fichier de la LoRA ; le rang (64) mesure sa capacité à modifier le modèle.',
          },
          {
            name: 'strength',
            value: '1',
            explain:
              "Intensité de la LoRA. Plus bas = accélération moins efficace (il faut plus d'étapes) ; au-dessus de 1, risque d'artefacts.",
          },
        ],
      },
      msHigh: {
        summary: "Règle le décalage du calendrier de bruit (shift 8) pour l'expert « bruit fort ».",
        detail:
          "Ce nœud décale les étapes vers les niveaux de bruit élevés. En vidéo, passer plus de temps dans le bruit fort aide à construire un mouvement cohérent sur toute la durée. Chaque expert a son propre nœud, réglé à la même valeur.",
        params: [
          {
            name: 'shift',
            value: '8',
            explain:
              "Plus haut = plus d'étapes consacrées à la structure et au mouvement (plus stable, parfois moins détaillé) ; plus bas = plus d'effort sur les détails, avec un risque de mouvement incohérent.",
          },
        ],
      },
      msLow: {
        summary: "Même shift (8) appliqué à l'expert « bruit faible », après la LoRA.",
        detail:
          "Identique au nœud HIGH, mais sur la branche « bruit faible » déjà modifiée par la LoRA Lightning. Garder le même shift des deux côtés assure que les deux experts suivent le même calendrier de bruit : le relais à l'étape 3 tombe au bon niveau.",
        params: [
          {
            name: 'shift',
            value: '8',
            explain: "Doit rester égal au shift de l'expert HIGH ; sinon le second passage reprend à un niveau de bruit qui ne correspond pas.",
          },
        ],
      },
      wan: {
        summary: "Prépare le latent vidéo (81 frames) et y ancre l'image de départ.",
        detail:
          "Ce nœud crée le latent vide de la vidéo, encode l'image de départ avec le VAE et l'ajoute aux conditionnements positif et négatif, pour que le modèle sache que la première frame est imposée. Il renvoie le conditionnement positif, le négatif et le latent, utilisés par les deux samplers.",
        params: [
          {
            name: 'width × height',
            value: '832 × 480',
            explain: 'Taille de chaque frame, reprise de ImageResize.',
          },
          {
            name: 'length',
            value: '81',
            explain:
              "Nombre de frames (secondes × 16 + 1). À 16 images par seconde, 81 frames ≈ 5 s. Plus long = plus de mémoire et un mouvement qui risque de dériver ; Wan est entraîné autour de 81 frames.",
          },
        ],
      },
      ksHigh: {
        summary: "Premier passage : étapes 0 → 3 sur 6, l'expert « bruit fort » pose la scène et le mouvement.",
        detail:
          "KSamplerAdvanced peut n'exécuter qu'une partie des étapes. Celui-ci ajoute le bruit de départ, réalise les 3 premières étapes sur 6 avec l'expert « bruit fort », puis s'arrête en gardant le bruit restant (return_with_leftover_noise) pour passer la main au second. Son CFG de 1,2 ajoute un léger guidage vers le prompt.",
        params: [
          {
            name: 'noise_seed',
            value: 'randomize',
            explain: 'Une nouvelle seed à chaque lancement = un nouveau mouvement à partir de la même image.',
          },
          {
            name: 'steps',
            value: '6',
            explain:
              "Nombre total d'étapes, partagé par les deux passages. Si peu suffisent grâce à Lightning ; en ajouter apporte un peu de détail mais allonge le calcul.",
          },
          {
            name: 'cfg',
            value: '1.2',
            explain:
              'Proche de 1 car le modèle est distillé : monter le CFG sature les couleurs et crée des artefacts ; à 1, le négatif est ignoré.',
          },
          {
            name: 'sampler / scheduler',
            value: 'euler / simple',
            explain:
              'Méthode et calendrier de débruitage. Euler est rapide et stable en peu d’étapes ; « simple » répartit les étapes régulièrement (après le shift).',
          },
          {
            name: 'start → end',
            value: '0 → 3',
            explain:
              "Les étapes traitées par cet expert. Lui en donner plus renforce la structure et le mouvement, mais laisse moins d'étapes au second pour les détails.",
          },
        ],
      },
      ksLow: {
        summary: "Second passage : étapes 3 → 6, l'expert « bruit faible » termine les détails.",
        detail:
          "Il reprend le latent encore bruité là où le premier s'est arrêté, sans ajouter de bruit, et termine les étapes 3 à 6 avec l'expert « bruit faible » (accéléré par la LoRA Lightning). Dans ce workflow, c'est la variante « KSampler with NAG (Advanced) » : à CFG 1 le prompt négatif est normalement ignoré, NAG lui redonne un effet à moindre coût.",
        params: [
          {
            name: 'steps',
            value: '6',
            explain: 'Même calendrier que le premier passage, pour que le relais tombe au bon niveau de bruit.',
          },
          {
            name: 'cfg',
            value: '1',
            explain:
              "À 1, une seule prédiction par étape : deux fois plus rapide qu'avec un vrai CFG. Le négatif passe alors par NAG.",
          },
          {
            name: 'sampler / scheduler',
            value: 'euler / simple',
            explain: 'Identiques au premier passage, pour une transition sans rupture.',
          },
          {
            name: 'start → end',
            value: '3 → fin',
            explain: "Reprend exactement là où le premier passage s'est arrêté et va jusqu'à la dernière étape.",
          },
        ],
      },
      decode: {
        summary: 'Reconvertit le latent vidéo en 81 images.',
        detail:
          "Le décodeur du VAE décompresse les tranches latentes, dans l'espace et dans le temps, pour retrouver les 81 frames en pixels. C'est l'équivalent du VAE Decode d'une image, appliqué à toute la séquence.",
      },
      rife: {
        summary: 'Double la fluidité : de 16 à 32 images par seconde, par interpolation.',
        detail:
          "RIFE est un réseau qui estime le mouvement : entre deux frames, il calcule où se déplace chaque pixel et fabrique l'image intermédiaire. Wan génère à 16 fps pour économiser du calcul ; RIFE double la cadence sans relancer le modèle de diffusion. La durée reste de 5 s, le mouvement devient plus fluide.",
        params: [
          {
            name: 'source_fps → target_fps',
            value: '16 → 32',
            explain:
              "Viser plus haut fluidifie encore, mais les objets rapides peuvent se déformer (frames inventées) ; garder 16 évite toute interpolation.",
          },
        ],
      },
      mmaudio: {
        summary: 'Optionnel : génère une bande son synchronisée avec la vidéo.',
        detail:
          "MMAudio regarde les frames et un prompt texte pour créer un son cohérent avec l'action (pas, vent, impacts), synchronisé à l'image. Il est désactivé par défaut dans ce workflow et s'active d'un clic.",
        params: [
          {
            name: 'steps',
            value: '75',
            explain: "Plus d'étapes = son plus propre (entre 50 et 100 recommandé), mais génération plus longue.",
          },
          {
            name: 'cfg',
            value: '5',
            explain: 'Fidélité au prompt audio. Trop haut = son agressif ou métallique ; trop bas = son vague.',
          },
          {
            name: 'negative_prompt',
            value: 'low quality, speech, talking, background music…',
            explain: 'Repousse les voix et la musique de fond pour ne garder que les bruitages.',
          },
        ],
      },
      combine: {
        summary: 'Assemble les images (et le son) en fichier MP4.',
        detail:
          "Encode la suite d'images en vidéo H.264 à 32 fps, avec la piste audio si MMAudio est actif. Le CRF règle le compromis entre qualité et poids du fichier.",
        params: [
          {
            name: 'format',
            value: 'h264-mp4 · yuv420p',
            explain: 'Format lisible partout : navigateurs, téléphones, réseaux sociaux.',
          },
          {
            name: 'frame_rate',
            value: '32',
            explain: "Doit correspondre à la sortie de RIFE ; sinon la vidéo serait accélérée ou ralentie.",
          },
          {
            name: 'crf',
            value: '19',
            explain:
              'Plus bas = meilleure qualité mais fichier plus lourd ; plus haut = fichier léger mais artefacts de compression. 19 est quasiment sans perte visible.',
          },
        ],
      },
    },
  },
  i3d: {
    title: 'TRELLIS.2 — Image → 3D',
    tagline: "Transformer une seule image en objet 3D, sans aucun prompt texte : la forme est déduite de l'image.",
    io: 'Image → Mesh 3D (GLB/OBJ)',
    features: [
      'Image unique → Mesh 3D',
      'Structure en voxels, puis forme fine',
      'Trous bouchés et maillage simplifié',
      'Export GLB / OBJ',
    ],
    nodes: {
      load: {
        summary: "Charge l'image de l'objet, avec sa transparence.",
        detail:
          "L'image source est la seule information donnée au modèle. Son canal de transparence (alpha) indique déjà où est l'objet et où est le fond. Un objet entier, bien éclairé et isolé donne la meilleure reconstruction.",
      },
      model: {
        summary: 'Charge TRELLIS.2-4B, le modèle de Microsoft qui génère la 3D.',
        detail:
          "TRELLIS.2 (4 milliards de paramètres) est un modèle de diffusion qui ne travaille pas sur des pixels mais sur une représentation 3D faite de voxels (petits cubes). Il regroupe plusieurs sous-modèles : un pour la structure grossière, un pour la forme fine, et des décodeurs.",
        params: [
          {
            name: 'model',
            value: 'microsoft/TRELLIS.2-4B',
            explain: 'Les poids officiels, téléchargés au premier lancement.',
          },
        ],
      },
      pre: {
        summary: "Détoure l'objet et le recadre en 1024 px.",
        detail:
          "Le fond est retiré, l'objet est centré et recadré avec une petite marge, puis mis à l'échelle. Le modèle attend un objet isolé : un fond chargé serait interprété comme une partie de l'objet.",
        params: [
          {
            name: 'resolution',
            value: '1024',
            explain: "Taille de l'image transmise. Plus grand = plus de détails captés mais plus de calcul ; plus petit = détails fins perdus.",
          },
        ],
      },
      cond: {
        summary: "Extrait les caractéristiques visuelles de l'image avec DINOv3 : c'est le « prompt » du modèle.",
        detail:
          "Il n'y a aucun prompt texte : l'image elle-même est la seule condition. DINOv3, un réseau de vision, la découpe en petits carrés (patchs) et décrit chacun par un vecteur (forme, matière, contours). Les deux générateurs consultent ces vecteurs à chaque étape, comme un modèle texte → image consulte le prompt encodé. Pour changer le résultat, on change l'image, pas une phrase.",
      },
      sparse: {
        summary: 'Étape 1 : génère la structure grossière en voxels (50 étapes).',
        detail:
          "Un premier modèle de diffusion débruite une grille 3D et décide quelles cases (voxels) sont occupées : c'est la silhouette 3D de l'objet, encore façon « Lego ». Il suit la condition image avec un guidage CFG, comme pour une image. La seed est fixe : relancer donne exactement la même structure.",
        params: [
          {
            name: 'seed',
            value: '12345 (fixed)',
            explain: 'Fixe = résultat reproductible. Changer la seed propose une autre interprétation des parties cachées (dos, dessous).',
          },
          {
            name: 'steps',
            value: '50',
            explain: "Plus d'étapes = structure plus propre et cohérente, mais plus lente ; trop peu = volumes manquants ou bruités.",
          },
          {
            name: 'cfg',
            value: '7.5',
            explain:
              "Fidélité à l'image. Plus haut = colle davantage à la silhouette vue, avec un risque d'artefacts ; plus bas = forme plus libre, parfois éloignée de l'image.",
          },
          {
            name: 'sampler',
            value: 'heun',
            explain: "Heun fait deux évaluations par étape : plus précis qu'euler à nombre d'étapes égal, mais deux fois plus lent.",
          },
        ],
      },
      shape: {
        summary: 'Étape 2 : sculpte la forme fine sur ces voxels (résolution 1024, 25 étapes).',
        detail:
          "Un second modèle de diffusion part des voxels occupés et génère pour chacun un latent détaillé de la surface (creux, arêtes, reliefs), en consultant à nouveau l'image. Même logique que les deux experts de la vidéo : d'abord la structure, ensuite les détails.",
        params: [
          {
            name: 'resolution',
            value: '1024',
            explain: 'Finesse de la forme. Plus haut = surfaces plus détaillées, mais beaucoup plus de mémoire et de temps.',
          },
          {
            name: 'steps',
            value: '25',
            explain: "Moins d'étapes que la structure : la forme générale est déjà fixée, il reste à préciser la surface.",
          },
          {
            name: 'cfg',
            value: '7.5',
            explain: "Même rôle qu'à l'étape 1 : plus haut = détails plus fidèles à l'image, mais risque d'artefacts.",
          },
        ],
      },
      decode: {
        summary: 'Convertit les latents de forme en maillage 3D brut.',
        detail:
          "Le décodeur transforme les latents attachés aux voxels en surface 3D : un maillage de triangles (sommets + faces). C'est l'équivalent du VAE Decode pour la 3D : on passe de nombres abstraits à une géométrie qu'un logiciel 3D sait afficher.",
      },
      fill: {
        summary: 'Bouche les trous du maillage.',
        detail:
          "Le maillage brut peut garder de petites ouvertures, surtout dans les zones que l'image ne montrait pas. Ce nœud repère les bords ouverts et les referme pour obtenir un objet fermé, indispensable pour l'impression 3D et plus propre à texturer.",
      },
      recon: {
        summary: 'Reconstruit une topologie propre, en quadrilatères.',
        detail:
          "Le maillage décodé est dense et irrégulier. Ce nœud le refait à une résolution de 1024 en privilégiant les quadrilatères (quads) : une structure régulière, plus facile à éditer, déplier pour la texture ou animer dans Blender.",
        params: [
          {
            name: 'resolution',
            value: '1024',
            explain: 'Densité du nouveau maillage. Plus haut = suit mieux les détails ; plus bas = maillage plus léger mais arrondi.',
          },
        ],
      },
      simplify: {
        summary: 'Réduit le maillage à 1 000 000 de faces au maximum.',
        detail:
          "Un mesh trop dense est lourd à afficher et à manipuler. La simplification fusionne les faces dans les zones plates et garde la densité là où il y a du détail.",
        params: [
          {
            name: 'target_face_num',
            value: '1 000 000',
            explain:
              'Moins de faces = fichier léger et rapide (jeu, web), mais détails arrondis ; plus de faces = fidélité maximale, fichier lourd.',
          },
        ],
      },
      export: {
        summary: "Enregistre l'objet 3D en fichier GLB ou OBJ.",
        detail:
          "GLB est un format compact (un seul fichier) lu par les navigateurs, Blender, Unity ou Unreal ; OBJ est un format texte universel. Le fichier peut ensuite être retouché, texturé ou imprimé.",
        params: [
          {
            name: 'format',
            value: 'obj (ou glb)',
            explain: 'OBJ pour la compatibilité maximale avec les logiciels 3D ; GLB pour le web et les moteurs de jeu.',
          },
        ],
      },
      preview: {
        summary: 'Affiche le mesh dans une vue 3D interactive.',
        detail:
          "Permet de tourner autour de l'objet, zoomer et vérifier le résultat sans quitter ComfyUI, avant de l'ouvrir dans un logiciel 3D.",
      },
    },
  },
};

const textEN: Record<WorkflowId, WorkflowText> = {
  t2i: {
    title: 'FLUX.2 Klein 9B — Text → Image',
    tagline: 'Describe a scene in words and get a realistic image, built by removing noise step by step.',
    io: 'Text → Image 1280×1280',
    features: [
      'Realistic characters and objects',
      'References for 3D reconstruction',
      'Dynamic action poses',
      'Variant: text-guided image editing',
    ],
    nodes: {
      unet: {
        summary: 'Loads FLUX.2 Klein 9B, the diffusion model that "draws" by removing noise.',
        detail:
          "The diffusion model (9 billion parameters) has learned to remove a little noise from an image at each step, following the text. It never handles pixels: it works in latent space, a compressed version of the image that is much faster to compute. This is the \"base\" (non-distilled) version: it uses real CFG guidance, so the negative prompt matters. The fp8 format stores weights in 8 bits, halving the video memory needed for a minimal quality loss.",
        params: [
          {
            name: 'unet_name',
            value: 'flux-2-klein-base-9b-fp8',
            explain:
              'The model file. A bigger model follows complex prompts better but needs more video memory and time.',
          },
        ],
      },
      clip: {
        summary: 'Loads the Qwen 3 8B text encoder, which translates the prompt into the model\'s language.',
        detail:
          "The diffusion model can't read words: it needs vectors of numbers. This encoder, an 8-billion-parameter Qwen 3 language model, turns the prompt into a sequence of vectors (embeddings) that carry the sentence's meaning. The name \"CLIP\" is historical: ComfyUI uses it for any text encoder. A powerful encoder better understands long descriptions, relative positions and text to be written in the image.",
        params: [
          {
            name: 'clip_name',
            value: 'qwen_3_8b_fp8mixed',
            explain: 'Encoder weights in mixed precision: 8 bits for most layers, more precision where it matters.',
          },
          {
            name: 'type',
            value: 'flux2',
            explain: 'Tells ComfyUI how to format embeddings for FLUX.2. With the wrong type, the image no longer matches the prompt.',
          },
        ],
      },
      pos: {
        summary: 'Encodes the positive prompt: what the image should show.',
        detail:
          "The text (subject, pose, lighting, framing…) goes through the encoder and becomes \"conditioning\". At each step, the guider compares what the model predicts with this conditioning and with the negative one, then pushes the image toward the version matching the positive: the positive prompt attracts. The more precise and structured it is, the less the model improvises.",
        params: [
          {
            name: 'text',
            value: '"A full-body 3D reference image of…"',
            explain:
              "The workflow's actual prompt (a character reference for 3D). Adding details reduces randomness; a vague prompt lets the model choose.",
          },
        ],
      },
      neg: {
        summary: 'Encodes the negative prompt: what the image should avoid.',
        detail:
          "It is encoded exactly like the positive, but the guider uses it as something to move away from: at each step, the image is pushed away from what it describes (blur, extra fingers, stray text…). Here it is empty: the reference point is then the \"no description\" prediction, and guidance simply strengthens everything that comes from the positive prompt. The negative only has an effect when CFG is above 1.",
        params: [
          {
            name: 'text',
            value: '(empty)',
            explain:
              'Empty = nothing specific to push away. Writing defects here ("blurry, extra fingers") makes them recede, but a long list can also flatten the image.',
          },
        ],
      },
      noise: {
        summary: 'Produces the starting noise, entirely defined by the seed.',
        detail:
          'Every generation starts from random noise that the model sculpts. This noise is determined by a single number, the seed: same seed and same settings give the same image. With "randomize", a new seed is drawn on every run, hence a new composition.',
        params: [
          {
            name: 'noise_seed',
            value: '572357623973097',
            explain:
              'Changing the seed changes the composition (pose, framing, colors) without touching the prompt. Noting a good image\'s seed lets you reproduce it.',
          },
          {
            name: 'control_after_generate',
            value: 'randomize',
            explain:
              '"randomize" draws a different seed on every run; "fixed" keeps it, so you can edit the prompt while keeping the same base image.',
          },
        ],
      },
      guider: {
        summary: 'Combines the model with the positive / negative prompts at a guidance strength (CFG 5).',
        detail:
          'At each step, the model makes two predictions: one with the positive prompt, one with the negative. The guider amplifies the gap between them: result = negative + CFG × (positive − negative). At 1, only the positive counts and the negative is not even computed; above that, the image sticks more closely to the text.',
        params: [
          {
            name: 'cfg',
            value: '5',
            explain:
              'How strongly the prompt is followed. Higher: more faithful to the text, but saturated colors, harsh contrast, even artifacts. Lower: more natural look, but the description is followed less closely.',
          },
        ],
      },
      select: {
        summary: 'Picks the denoising algorithm: euler.',
        detail:
          "The sampler is the computation method that moves the image from one noise level to the next. Euler is the simplest: one prediction per step, fast and stable. Others (heun, dpmpp_2m…) take more elaborate steps, sometimes more accurate with few steps, sometimes slower.",
        params: [
          {
            name: 'sampler_name',
            value: 'euler',
            explain:
              'Switching samplers slightly changes the look and the speed. "Ancestral" variants (euler_a) re-inject noise at each step: more variety, but the image never fully settles.',
          },
        ],
      },
      scheduler: {
        summary: 'Plans the denoising schedule, spread over 30 steps.',
        detail:
          'The scheduler computes the list of noise levels (the "sigmas") to go through, from pure noise to a clean image. The FLUX.2 one adapts this curve to the resolution: a large image stays longer in high noise, giving it time to settle the composition. The sampler then follows this schedule step by step.',
        params: [
          {
            name: 'steps',
            value: '30',
            explain:
              'Number of denoising steps. More steps = finer details up to a plateau, but proportional time; too few = blurry or unfinished image.',
          },
        ],
      },
      latent: {
        summary: 'Creates the starting canvas: an empty 1280×1280 latent.',
        detail:
          "The latent is the image in compressed form: a small grid of numbers, much smaller than the final image, where the model works far faster than in pixels. This node sets its size and the number of images; noise is added afterwards by RandomNoise.",
        params: [
          {
            name: 'width × height',
            value: '1280 × 1280',
            explain:
              'Output resolution. Bigger = more detail, but slower and more memory; too far from training sizes, the model may duplicate elements.',
          },
          {
            name: 'batch_size',
            value: '1',
            explain: 'Number of images generated at once. Raising it lets you compare several variants in one go, at the cost of memory.',
          },
        ],
      },
      sampler: {
        summary: 'Runs the denoising: from noise to the final latent image.',
        detail:
          'This is the engine that assembles the four pieces: noise (RandomNoise), method (KSamplerSelect), schedule (Flux2Scheduler) and guidance (CFGGuider), then denoises the latent step by step. The classic KSampler does all of this in a single "all-in-one" node (seed, steps, cfg, sampler, scheduler); FLUX splits it into separate nodes so each piece can be swapped independently. The result is a clean latent, still unreadable until it is decoded.',
      },
      vae: {
        summary: 'Loads the VAE, the translator between pixels and latent space.',
        detail:
          'The VAE (variational autoencoder) compresses an image into a latent (encoder) and rebuilds pixels from the latent (decoder). Here only the decoder is used, at the very end. Editing variant of the same workflow: LoadImage → VAEEncode → ReferenceLatent encodes an existing image and attaches it to the conditioning, to modify it instead of starting from scratch.',
        params: [
          {
            name: 'vae_name',
            value: 'full_encoder_small_decoder',
            explain: 'Full encoder paired with a lighter decoder: faster, leaner decoding, at the cost of very fine details being slightly softer.',
          },
        ],
      },
      decode: {
        summary: 'Turns the latent back into a real image, in pixels.',
        detail:
          "The VAE decoder expands the compressed latent grid into a full-resolution color image, recreating textures and fine details. It is the only step that produces visible pixels; a VAE that doesn't match the model gives wrong colors or a garbled image.",
      },
      save: {
        summary: 'Saves the final image to disk.',
        detail:
          'Writes the image as a PNG to the output folder, with the whole workflow hidden in its metadata: dropping the PNG into ComfyUI reloads the graph and its settings. Preview Image does the same without saving.',
        params: [
          {
            name: 'filename_prefix',
            value: 'flux2_klein_edit',
            explain: 'Start of the file name; ComfyUI appends a counter so no image is ever overwritten.',
          },
        ],
      },
    },
  },
  i2v: {
    title: 'Wan 2.2 14B — Image → Video',
    tagline: 'Animate a still image into a 5-second video guided by a prompt, with two expert models handing off to each other.',
    io: 'Image + text → Video 5 s · 832×480 · 32 fps',
    features: [
      'Image → Video',
      'Two experts (structure, then details) in 6 steps',
      'RIFE interpolation 16 → 32 fps',
      'Optional automatic audio (MMAudio)',
    ],
    nodes: {
      load: {
        summary: 'Loads the starting image, which becomes the first frame of the video.',
        detail:
          'The provided image is enforced as the first frame: the model must keep it and invent the motion that follows. Its sharpness and framing carry through the whole video.',
      },
      resize: {
        summary: 'Fits the image to the video format (832×480).',
        detail:
          'The image is resized and its dimensions are passed to WanImageToVideo, so the video has exactly the same framing. Size matters a lot: every added pixel is computed across 81 frames.',
        params: [
          {
            name: 'width × height',
            value: '832 × 480',
            explain: 'Video resolution. Bigger = more detail, but time and memory explode; smaller = fast but blurry.',
          },
          {
            name: 'upscale_method',
            value: 'lanczos',
            explain: 'Resizing method; lanczos keeps edges sharp.',
          },
          {
            name: 'divisible_by',
            value: '16',
            explain: "Rounds dimensions to a multiple of 16, as required by the video model's latent compression.",
          },
        ],
      },
      clip: {
        summary: 'Loads the UMT5-XXL text encoder used by Wan.',
        detail:
          'UMT5-XXL is a multilingual text encoder: it turns the prompt into vectors the video model understands. Here it runs on the processor (CPU) to leave all of the graphics card\'s memory to the 14-billion-parameter model.',
        params: [
          {
            name: 'clip_name',
            value: 'umt5_xxl_fp8_e4m3fn_scaled',
            explain: 'Encoder weights in 8 bits: half the memory of 16 bits, for a minimal difference.',
          },
          {
            name: 'device',
            value: 'cpu',
            explain: 'Encoding on CPU is slower but frees video memory; it runs only once per prompt, so the cost stays low.',
          },
        ],
      },
      pos: {
        summary: 'Describes the desired motion: action, camera, mood.',
        detail:
          "In image → video, the image already sets the look: the prompt mostly describes what moves (gesture, camera move, wind, light). It becomes conditioning that WanImageToVideo pairs with the starting image. With a CFG close to 1, it guides the generation almost on its own.",
      },
      neg: {
        summary: 'Lists what the video should avoid — limited effect in this workflow.',
        detail:
          'A negative prompt only acts when CFG is above 1: the sampler then compares the predictions with the positive and with the negative, and moves away from the latter. Here the first pass runs at CFG 1.2 (slight effect) and the second at 1, where the negative is ignored. That is why the second pass uses an NAG variant (Normalized Attention Guidance), which gives the negative an effect again even at CFG 1.',
      },
      vae: {
        summary: 'Loads the Wan 2.1 VAE, which compresses and rebuilds the frames.',
        detail:
          'The video VAE compresses space (8× per side) and time (4 frames → 1): the 81 frames become 21 latent "slices", which makes generation possible on a single graphics card. It is used twice: to encode the starting image in WanImageToVideo, and to decode the final video. Wan 2.2 14B reuses the Wan 2.1 VAE.',
        params: [
          {
            name: 'vae_name',
            value: 'wan_2.1_vae',
            explain: 'Must match the model: another VAE would give wrong colors or a noisy image.',
          },
        ],
      },
      unetHigh: {
        summary: 'Loads the Wan 2.2 "high-noise" expert, which sets the scene and the motion.',
        detail:
          'Wan 2.2 14B uses two experts (Mixture of Experts): this one handles the first, very noisy steps, where composition and overall motion are decided. It then goes through its own Lightning LoRA before reaching the sampler. The fp8 weights fit on a consumer graphics card.',
        params: [
          {
            name: 'unet_name',
            value: 'Wan2.2_Remix_i2v_14b_high_lighting_fp8',
            explain: 'Image → video model for high noise; swapping it changes the style and the dynamics of the motion.',
          },
        ],
      },
      unetLow: {
        summary: 'Loads the "low-noise" expert, which refines the details.',
        detail:
          "The second expert takes over once the video is almost formed: it handles textures, faces and frame-to-frame stability. Two specialists give the quality of a much bigger model, while only one 14B model runs at each step.",
        params: [
          {
            name: 'unet_name',
            value: 'Wan2.2_Remix_i2v_14b_low_lighting_fp8',
            explain: 'Image → video model for low noise; it decides the final level of detail.',
          },
        ],
      },
      loraHigh: {
        summary: 'Adds the Lightning 4-steps LoRA to the "high-noise" expert to generate in very few steps.',
        detail:
          "A LoRA is a small file of extra weights that changes a model's behavior without retraining it. Lightning is a distillation: it teaches the model to do in a few steps, with a CFG close to 1, what used to take dozens. Each expert has its own Lightning LoRA, trained for its noise range: this one for high noise.",
        params: [
          {
            name: 'lora',
            value: 'Wan22_A14B_T2V_HIGH_Lightning_4steps (rank 128)',
            explain: 'The LoRA file; the rank (128) measures how much it can change the model: higher = more expressive, but heavier.',
          },
          {
            name: 'strength',
            value: '1',
            explain: 'LoRA intensity. Lower = weaker acceleration (more steps needed); above 1, risk of artifacts.',
          },
        ],
      },
      loraLow: {
        summary: 'Adds the Lightning 4-steps LoRA to the "low-noise" expert to finish in very few steps.',
        detail:
          'Same principle as on the "high-noise" branch, with the LoRA trained for the last, low-noise steps. Thanks to both LoRAs, the whole video fits in 6 steps: a few minutes instead of tens of minutes, at the cost of some variety.',
        params: [
          {
            name: 'lora',
            value: 'Wan22_A14B_T2V_LOW_Lightning_4steps (rank 64)',
            explain: 'The LoRA file; the rank (64) measures how much it can change the model.',
          },
          {
            name: 'strength',
            value: '1',
            explain: 'LoRA intensity. Lower = weaker acceleration (more steps needed); above 1, risk of artifacts.',
          },
        ],
      },
      msHigh: {
        summary: 'Sets the noise schedule shift (8) for the "high-noise" expert.',
        detail:
          'This node shifts the steps toward high noise levels. For video, spending more time in high noise helps build motion that stays coherent over the whole clip. Each expert has its own node, set to the same value.',
        params: [
          {
            name: 'shift',
            value: '8',
            explain:
              'Higher = more steps spent on structure and motion (more stable, sometimes less detailed); lower = more effort on details, with a risk of incoherent motion.',
          },
        ],
      },
      msLow: {
        summary: 'Same shift (8) applied to the "low-noise" expert, after the LoRA.',
        detail:
          'Identical to the HIGH node, but on the "low-noise" branch already modified by the Lightning LoRA. Keeping the same shift on both sides ensures both experts follow the same noise schedule: the hand-off at step 3 lands at the right level.',
        params: [
          {
            name: 'shift',
            value: '8',
            explain: 'Must match the HIGH expert\'s shift; otherwise the second pass resumes at a mismatched noise level.',
          },
        ],
      },
      wan: {
        summary: 'Prepares the video latent (81 frames) and anchors the starting image in it.',
        detail:
          'This node creates the empty video latent, encodes the starting image with the VAE and adds it to the positive and negative conditioning, so the model knows the first frame is fixed. It outputs the positive conditioning, the negative and the latent, used by both samplers.',
        params: [
          {
            name: 'width × height',
            value: '832 × 480',
            explain: 'Size of each frame, taken from ImageResize.',
          },
          {
            name: 'length',
            value: '81',
            explain:
              'Number of frames (seconds × 16 + 1). At 16 frames per second, 81 frames ≈ 5 s. Longer = more memory and motion that may drift; Wan is trained around 81 frames.',
          },
        ],
      },
      ksHigh: {
        summary: 'First pass: steps 0 → 3 of 6, the "high-noise" expert sets the scene and the motion.',
        detail:
          'KSamplerAdvanced can run only part of the steps. This one adds the starting noise, runs the first 3 of 6 steps with the "high-noise" expert, then stops while keeping the remaining noise (return_with_leftover_noise) to hand over to the second one. Its CFG of 1.2 adds slight guidance toward the prompt.',
        params: [
          {
            name: 'noise_seed',
            value: 'randomize',
            explain: 'A new seed on every run = new motion from the same image.',
          },
          {
            name: 'steps',
            value: '6',
            explain:
              'Total number of steps, shared by both passes. So few are enough thanks to Lightning; adding more brings a bit of detail but takes longer.',
          },
          {
            name: 'cfg',
            value: '1.2',
            explain:
              'Close to 1 because the model is distilled: raising CFG saturates colors and creates artifacts; at 1, the negative is ignored.',
          },
          {
            name: 'sampler / scheduler',
            value: 'euler / simple',
            explain: 'Denoising method and schedule. Euler is fast and stable with few steps; "simple" spaces the steps evenly (after the shift).',
          },
          {
            name: 'start → end',
            value: '0 → 3',
            explain:
              'The steps handled by this expert. Giving it more strengthens structure and motion, but leaves fewer steps for the second one to add detail.',
          },
        ],
      },
      ksLow: {
        summary: 'Second pass: steps 3 → 6, the "low-noise" expert finishes the details.',
        detail:
          'It picks up the still-noisy latent where the first pass stopped, without adding noise, and runs steps 3 to 6 with the "low-noise" expert (sped up by the Lightning LoRA). In this workflow it is the "KSampler with NAG (Advanced)" variant: at CFG 1 the negative prompt is normally ignored, and NAG gives it an effect again at low cost.',
        params: [
          {
            name: 'steps',
            value: '6',
            explain: 'Same schedule as the first pass, so the hand-off lands at the right noise level.',
          },
          {
            name: 'cfg',
            value: '1',
            explain: 'At 1, a single prediction per step: twice as fast as real CFG. The negative then goes through NAG.',
          },
          {
            name: 'sampler / scheduler',
            value: 'euler / simple',
            explain: 'Same as the first pass, for a seamless transition.',
          },
          {
            name: 'start → end',
            value: '3 → end',
            explain: 'Resumes exactly where the first pass stopped and runs to the last step.',
          },
        ],
      },
      decode: {
        summary: 'Turns the video latent back into 81 images.',
        detail:
          "The VAE decoder decompresses the latent slices, in space and in time, to recover the 81 frames as pixels. It is the image VAE Decode applied to the whole sequence.",
      },
      rife: {
        summary: 'Doubles smoothness: from 16 to 32 frames per second, by interpolation.',
        detail:
          'RIFE is a network that estimates motion: between two frames, it computes where each pixel moves and creates the in-between image. Wan generates at 16 fps to save compute; RIFE doubles the frame rate without re-running the diffusion model. The duration stays 5 s, the motion gets smoother.',
        params: [
          {
            name: 'source_fps → target_fps',
            value: '16 → 32',
            explain: 'Going higher smooths further, but fast objects may warp (invented frames); keeping 16 skips interpolation entirely.',
          },
        ],
      },
      mmaudio: {
        summary: 'Optional: generates a soundtrack synchronized with the video.',
        detail:
          'MMAudio looks at the frames and a text prompt to create sound that fits the action (footsteps, wind, impacts), synchronized with the picture. It is disabled by default in this workflow and can be turned on in one click.',
        params: [
          {
            name: 'steps',
            value: '75',
            explain: 'More steps = cleaner sound (50 to 100 recommended), but longer generation.',
          },
          {
            name: 'cfg',
            value: '5',
            explain: 'How closely the audio prompt is followed. Too high = harsh or metallic sound; too low = vague sound.',
          },
          {
            name: 'negative_prompt',
            value: 'low quality, speech, talking, background music…',
            explain: 'Pushes away voices and background music to keep only sound effects.',
          },
        ],
      },
      combine: {
        summary: 'Assembles the images (and sound) into an MP4 file.',
        detail:
          'Encodes the image sequence into an H.264 video at 32 fps, with the audio track if MMAudio is on. CRF sets the trade-off between quality and file size.',
        params: [
          {
            name: 'format',
            value: 'h264-mp4 · yuv420p',
            explain: 'A format that plays everywhere: browsers, phones, social networks.',
          },
          {
            name: 'frame_rate',
            value: '32',
            explain: "Must match RIFE's output; otherwise the video would play too fast or too slow.",
          },
          {
            name: 'crf',
            value: '19',
            explain:
              'Lower = better quality but heavier file; higher = lighter file but compression artifacts. 19 is visually near-lossless.',
          },
        ],
      },
    },
  },
  i3d: {
    title: 'TRELLIS.2 — Image → 3D',
    tagline: 'Turn a single image into a 3D object, with no text prompt at all: the shape is inferred from the image.',
    io: 'Image → 3D mesh (GLB/OBJ)',
    features: [
      'Single image → 3D mesh',
      'Voxel structure, then fine shape',
      'Hole filling and mesh simplification',
      'GLB / OBJ export',
    ],
    nodes: {
      load: {
        summary: 'Loads the image of the object, with its transparency.',
        detail:
          "The source image is the only information given to the model. Its transparency (alpha) channel already tells where the object is and where the background is. A whole, well-lit, isolated object gives the best reconstruction.",
      },
      model: {
        summary: "Loads TRELLIS.2-4B, Microsoft's model that generates the 3D.",
        detail:
          'TRELLIS.2 (4 billion parameters) is a diffusion model that works not on pixels but on a 3D representation made of voxels (small cubes). It bundles several sub-models: one for the coarse structure, one for the fine shape, and decoders.',
        params: [
          {
            name: 'model',
            value: 'microsoft/TRELLIS.2-4B',
            explain: 'The official weights, downloaded on first run.',
          },
        ],
      },
      pre: {
        summary: 'Cuts out the object and crops it to 1024 px.',
        detail:
          'The background is removed, the object is centered and cropped with a small margin, then scaled. The model expects an isolated object: a busy background would be read as part of the object.',
        params: [
          {
            name: 'resolution',
            value: '1024',
            explain: 'Size of the image passed on. Bigger = more detail captured but more compute; smaller = fine details lost.',
          },
        ],
      },
      cond: {
        summary: "Extracts the image's visual features with DINOv3: this is the model's \"prompt\".",
        detail:
          'There is no text prompt: the image itself is the only condition. DINOv3, a vision network, cuts it into small squares (patches) and describes each with a vector (shape, material, edges). Both generators consult these vectors at every step, just as a text → image model consults the encoded prompt. To change the result, you change the image, not a sentence.',
      },
      sparse: {
        summary: 'Stage 1: generates the coarse voxel structure (50 steps).',
        detail:
          'A first diffusion model denoises a 3D grid and decides which cells (voxels) are filled: this is the 3D silhouette of the object, still "Lego-like". It follows the image condition with CFG guidance, just like for an image. The seed is fixed: re-running gives exactly the same structure.',
        params: [
          {
            name: 'seed',
            value: '12345 (fixed)',
            explain: 'Fixed = reproducible result. Changing the seed offers another interpretation of hidden parts (back, underside).',
          },
          {
            name: 'steps',
            value: '50',
            explain: 'More steps = cleaner, more coherent structure, but slower; too few = missing or noisy volumes.',
          },
          {
            name: 'cfg',
            value: '7.5',
            explain:
              'Faithfulness to the image. Higher = sticks more closely to the visible silhouette, with a risk of artifacts; lower = freer shape, sometimes far from the image.',
          },
          {
            name: 'sampler',
            value: 'heun',
            explain: 'Heun makes two evaluations per step: more accurate than euler for the same number of steps, but twice as slow.',
          },
        ],
      },
      shape: {
        summary: 'Stage 2: sculpts the fine shape on those voxels (resolution 1024, 25 steps).',
        detail:
          'A second diffusion model starts from the filled voxels and generates, for each one, a detailed latent of the surface (hollows, edges, reliefs), consulting the image again. Same logic as the two video experts: structure first, details second.',
        params: [
          {
            name: 'resolution',
            value: '1024',
            explain: 'Shape fineness. Higher = more detailed surfaces, but much more memory and time.',
          },
          {
            name: 'steps',
            value: '25',
            explain: 'Fewer steps than the structure: the overall shape is already set, only the surface remains to refine.',
          },
          {
            name: 'cfg',
            value: '7.5',
            explain: 'Same role as in stage 1: higher = details more faithful to the image, but risk of artifacts.',
          },
        ],
      },
      decode: {
        summary: 'Converts the shape latents into a raw 3D mesh.',
        detail:
          "The decoder turns the latents attached to the voxels into a 3D surface: a mesh of triangles (vertices + faces). It is the 3D equivalent of VAE Decode: from abstract numbers to geometry that 3D software can display.",
      },
      fill: {
        summary: 'Fills the holes in the mesh.',
        detail:
          "The raw mesh may keep small openings, especially in areas the image didn't show. This node finds the open edges and closes them to get a watertight object, essential for 3D printing and cleaner to texture.",
      },
      recon: {
        summary: 'Rebuilds a clean topology made of quads.',
        detail:
          'The decoded mesh is dense and irregular. This node remeshes it at a resolution of 1024, favoring quadrilaterals (quads): a regular structure that is easier to edit, UV-unwrap for texturing, or animate in Blender.',
        params: [
          {
            name: 'resolution',
            value: '1024',
            explain: 'Density of the new mesh. Higher = follows details better; lower = lighter mesh but rounded.',
          },
        ],
      },
      simplify: {
        summary: 'Reduces the mesh to at most 1,000,000 faces.',
        detail:
          'A mesh that is too dense is heavy to display and handle. Simplification merges faces in flat areas and keeps density where there is detail.',
        params: [
          {
            name: 'target_face_num',
            value: '1,000,000',
            explain: 'Fewer faces = light, fast file (games, web) but rounded details; more faces = maximum fidelity, heavy file.',
          },
        ],
      },
      export: {
        summary: 'Saves the 3D object as a GLB or OBJ file.',
        detail:
          'GLB is a compact format (a single file) read by browsers, Blender, Unity or Unreal; OBJ is a universal text format. The file can then be retouched, textured or printed.',
        params: [
          {
            name: 'format',
            value: 'obj (or glb)',
            explain: 'OBJ for maximum compatibility with 3D software; GLB for the web and game engines.',
          },
        ],
      },
      preview: {
        summary: 'Shows the mesh in an interactive 3D view.',
        detail:
          'Lets you orbit the object, zoom and check the result without leaving ComfyUI, before opening it in 3D software.',
      },
    },
  },
};

export const getComfyUIWorkflows = (lang: Language): ComfyUIWorkflow[] => {
  const text = lang === 'fr' ? textFR : textEN;
  const list = base.map(({ nodes, edges, ...b }) => {
    const { nodes: nodeText, ...meta } = text[b.id];
    return { ...b, ...meta, flow: { nodes: nodes.map((node) => ({ ...node, ...nodeText[node.id] })), edges } };
  });
  if (import.meta.env.DEV) {
    for (const w of list) {
      const errors = validateFlow(w.flow);
      if (errors.length) console.error(`[flow ${w.id}]`, errors);
    }
  }
  return list;
};
