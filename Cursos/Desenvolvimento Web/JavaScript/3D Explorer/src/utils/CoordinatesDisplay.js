export function updateCoordinatesDisplay(object) {
    const coordsDiv = document.getElementById('coordinates');
    if (object) {
        const pos = object.position;
        const rot = object.rotation;
        const scale = object.scale;
        
        coordsDiv.innerHTML = `
            <div>Posição: X: ${pos.x.toFixed(2)} Y: ${pos.y.toFixed(2)} Z: ${pos.z.toFixed(2)}</div>
            <div>Rotação: X: ${(rot.x * 180 / Math.PI).toFixed(1)}° Y: ${(rot.y * 180 / Math.PI).toFixed(1)}° Z: ${(rot.z * 180 / Math.PI).toFixed(1)}°</div>
            <div>Escala: X: ${scale.x.toFixed(2)} Y: ${scale.y.toFixed(2)} Z: ${scale.z.toFixed(2)}</div>
        `;
    } else {
        coordsDiv.textContent = 'Nenhum objeto selecionado';
    }
}