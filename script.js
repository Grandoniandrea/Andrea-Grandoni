
function submitForm(e){
  e.preventDefault();
  const data = new FormData(e.target);
  const subject = encodeURIComponent('Richiesta booking dal sito');
  const body = [...data.entries()].map(([k,v])=>`${k}: ${v}`).join('%0D%0A');
  window.location.href = `mailto:grandoniandrea1@gmail.com?subject=${subject}&body=${body}`;
  return false;
}
