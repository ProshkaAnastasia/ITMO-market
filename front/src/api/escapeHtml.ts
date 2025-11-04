const entityMap: Map<string, string> = new Map([
    ['&', '&amp;'],
    ['<', '&lt;'],
    ['>', '&gt;'],
    ['"', '&quot;'],
    ["'", '&#39;'],
    ['/', '&#x2F;']
]);

function escapeHtml(text: string): string {
    return text.replace(/[&<>"'/]/g, (char): string => {
        return entityMap.get(char) || char;
    });
}

export default escapeHtml;