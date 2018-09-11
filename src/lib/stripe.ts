const instance = {
  Stripe: null,
  Elements: null,
};

export const getStripe = () => {
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
    instance.Stripe = (window as any).Stripe(key);
  }

  return instance.Stripe;
};

export const getElements = () => {
  if (instance.Elements) { return instance.Elements; }

  const s = instance.Stripe || getStripe();

  if (!s) {
    throw new Error('lib/stripe#getElements could not create stripe instance');
  }

  if (instance.Elements === null) {
    instance.Elements = (s as any).elements();
  }

  return instance.Elements;
};
