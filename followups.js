export function suggestFollowups(prompt) {
  // Extract key terms from the prompt for more relevant follow-ups
  const extractKeyTerms = (prompt) => {
    // Try to extract industry/domain from common patterns
    const industryMatch = prompt.match(/in\s+([^,\s]+(?:\s+[^,\s]+)*)/i);
    const companyMatch = prompt.match(/(?:compare|analyze|research)\s+([^,\s]+(?:\s+[^,\s]+)*)/i);
    
    if (industryMatch) return industryMatch[1];
    if (companyMatch) return companyMatch[1];
    
    // Fallback to general terms
    const generalTerms = ['technology', 'business', 'industry', 'market', 'field'];
    for (const term of generalTerms) {
      if (prompt.toLowerCase().includes(term)) return term;
    }
    
    return 'this domain';
  };

  const keyTerm = extractKeyTerms(prompt);
  
  // Generate contextual follow-ups based on prompt type
  if (prompt.toLowerCase().includes('weekly') || prompt.toLowerCase().includes('news')) {
    return [
      `What are the emerging trends in ${keyTerm} for the next quarter?`,
      `Which companies are making the biggest impact in ${keyTerm} this year?`
    ];
  } else if (prompt.toLowerCase().includes('compare') || prompt.toLowerCase().includes('competitor')) {
    return [
      `What are the key differentiators between these companies?`,
      `How do their market positions compare in terms of growth potential?`
    ];
  } else {
    return [
      `What are the current challenges in ${keyTerm}?`,
      `Which startups are leading innovation in ${keyTerm}?`
    ];
  }
} 