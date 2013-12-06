var story_resource_url = '';
var domain_patterns = {
  'facebook.com': {pattern: /\b(v=)([0-9]+)\b/, index: 2}, 
  'youtube.com': {pattern: /(v=)([a-zA-Z0-9-_]+)/, index: 2},
  'instagram.com': {pattern: /\/(p)\/([a-zA-Z0-9-_]+)/, index: 2},
  'storyful.com': {pattern: /\/(stories)\/([0-9-_]+)/, index: 2},
  'twitter.com': {pattern: /\/([a-zA-Z0-9-_]+)\/status\/([0-9-_]+)/, index: 2},
};

var get_query = function(url)
{
  var q = null;

  var a = document.createElement('a');
  a.href = url;
  var hostname = a.hostname.replace('www.', '');

  if (domain_patterns[hostname])
  {
    var match = url.match(domain_patterns[hostname]['pattern']);
    if (match)
    {
      q = match[domain_patterns[hostname]['index']];
    }
  }

  return q;
};

var action_url = '';
// Called when the url of a tab changes.
function checkIfURLMentioned(tabId, changeInfo, tab) {
  var q = get_query(tab.url);

  console.log(q);

  if (q)
  {
    $.getJSON('https://www.yammer.com/api/v1/search.json?search=' + q, function(data)
    {
      if (data['messages']['messages'].length > 0)
      {
        chrome.pageAction.setTitle({tabId: tabId, title: q + ' is mentioned'});
        chrome.pageAction.setIcon({tabId: tabId, path: 'yamcheck_19.png'});

        action_url = 'https://www.yammer.com/#/Threads/Search?type=following&search=' + q;
        chrome.pageAction.show(tabId);
      }
    });
  }
};

chrome.pageAction.onClicked.addListener(function(tab)
{
  chrome.tabs.create({'url': action_url}, function(tab) {
  });
});

chrome.tabs.onUpdated.addListener(checkIfURLMentioned);