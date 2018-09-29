interface IElement {
  mount: (id: string) => void;
  on: (name: string, fn: (event: {
    complete: boolean,
    empty: boolean,
    error?: {
      type: string,
      message: string,
    },
  }) => any) => void;
}

interface IStripeElements {
  create: (id?: string) => IElement;
}

interface IStripe {
  createToken: (element: IElement) => Promise<{
    token: any,
    error: any,
  }>;
}

export {
  IElement, IStripeElements, IStripe,
};

const instance: {
  Stripe: IStripe|null,
  Elements: IStripeElements|null,
  Card: IElement|null,
} = {
  Stripe: null,
  Elements: null,
  Card: null,
};

export const getStripe: () => IStripe = () => {
  if (instance.Stripe) { return instance.Stripe; }
  const key = process.env.VUE_APP_STRIPE_KEY || null;

  if (!key) {
    throw new Error('lib/stripe#getStripe requires an authentication key');
  }

  if (!window) {
    throw new Error('lib/stripe#getStripe only works in a browser!');
  }

  if (!window.hasOwnProperty('Stripe') || typeof (window as any).Stripe !== 'function') {
    throw new Error('lib/stripe#getStripe cannot find global Stripe library');
  }

  if (instance.Stripe === null) {
    instance.Stripe = (window as any).Stripe(key) as IStripe;
  }

  return instance.Stripe;
};

export const getElements: () => IStripeElements = () => {
  if (instance.Elements) { return instance.Elements; }

  const s = instance.Stripe || getStripe();

  if (!s) {
    throw new Error('lib/stripe#getElements could not create stripe instance');
  }

  if (instance.Elements === null) {
    instance.Elements = (s as any).elements();
  }

  return instance.Elements as IStripeElements;
};

export const getCard: () => IElement = () => {
  if (!instance.Elements) {
    throw new Error('lib/stripe#getCard requires an active Elements instance');
  }

  if (!instance.Card) {
    instance.Card = instance.Elements.create('card');
  }

  return instance.Card;
};
