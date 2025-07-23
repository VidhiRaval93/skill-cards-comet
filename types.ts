export type Skill = {
  id: string;
  title: string;
  promptTemplate: string; // use `{input}` for placeholder
  requiresInput?: boolean;
  mode?: 'browser' | 'assistant';
};

export type SkillInputs = {
  [key: string]: string;
};

export type SkillWithInputs = Skill & {
  inputs?: SkillInputs;
}; 